import CategorySelector from "@components/CategorySelector";
import FileSelector from "@components/FileSelector";
import AppButton from "@ui/AppButton";
import { categories } from "@utils/Category";
import colors from "@utils/colors";
import React, { FC, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { types } from "react-native-document-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as DocumentPicker from "expo-document-picker";
import * as yup from "yup";
import client from "src/api/client";
import { Keys, getFromAsyncStorage } from "@utils/asyncStorage";

interface FormFields {
  title: string;
  category: string;
  about: string;
  file?: DocumentPicker.DocumentPickerAsset;
  poster?: DocumentPicker.DocumentPickerAsset;
}

const audioInfoSchema = yup.object({
  title: yup.string().trim("Title Is Missing").required("Title Is Required"),
  category: yup
    .string()
    .trim("Tile Is Missing")
    .oneOf(categories, "categories is Missing"),
  about: yup.string().trim("About Is Missing").required("About Is Required"),
  file: yup.object().shape({
    uri: yup.string().required("Audio File URi Is Missing"),
    name: yup.string().required("Audio File Name Is Missing"),
    mimeType: yup.string().required("Audio File Is File Missing"),
    size: yup.number().required("Audio File Is  Size Missing"),
  }),
  poster: yup.object().shape({
    uri: yup.string(),
    name: yup.string(),
    mimeType: yup.string(),
    size: yup.number(),
  }),
});

const defaultForm: FormFields = {
  title: "",
  category: "",
  about: "",
};

interface Props {}

const Upload: FC<Props> = (props) => {
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [audioInfo, setAudioInfo] = useState({ ...defaultForm });

  const handleUpload = async () => {
    try {
      const data = await audioInfoSchema.validate(audioInfo);
      console.log("Upload", data);
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("about", data.about);
      formData.append("category", data.category as any);
      const audioFile = {
        name: data.file.name.split(".")[0],
        type: data.file.mimeType,
        uri: data.file.uri,
        size:data.file.size
      };
      formData.append("audioFile", audioFile as any);

      if (data.poster) {
        const poster = {
          name: data.poster.name,
          type: data.poster.mimeType,
          uri: data.poster.uri,
        };
        formData.append("poster", poster as any);
      }

      const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);

      const audio = await client.post("/audio/create", formData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload", audio.data);
    } catch (error: any) {
      if (error instanceof yup.ValidationError) {
        console.log(error);
      }
      console.log(
        "Status Code:",
        error.response.status,
        "Data:",
        error.response.data
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.fileContainer}>
        <FileSelector
          icon={
            <MaterialCommunityIcons
              name="image-outline"
              size={35}
              color={colors.SECONDARY}
            />
          }
          btnTitle="Select Poster"
          options={{ type: "image/*" }}
          onSelect={(poster) => {
            setAudioInfo({ ...audioInfo, poster });
          }}
        />
        <FileSelector
          icon={
            <MaterialCommunityIcons
              name="file-music-outline"
              size={35}
              color={colors.SECONDARY}
            />
          }
          btnTitle="Select Audio"
          style={{ marginLeft: 20 }}
          options={{ type: "audio/*" }}
          onSelect={(file) => {
            setAudioInfo({ ...audioInfo, file });
          }}
        />
      </View>
      <View style={styles.formContainer}>
        <TextInput
          placeholderTextColor={colors.INACTIVE_CONTRAST}
          style={styles.input}
          placeholder="Title"
          onChangeText={(text) => {
            setAudioInfo({ ...audioInfo, title: text });
          }}
        />
        <Pressable
          onPress={() => {
            setShowCategoryModal(true);
          }}
          style={styles.categorySelector}
        >
          <Text style={styles.categorySelectorTitle}>Category</Text>
          <Text style={styles.selectedCategory}>{audioInfo.category}</Text>
        </Pressable>
        <TextInput
          placeholderTextColor={colors.INACTIVE_CONTRAST}
          style={[{ textAlignVertical: "top" }, styles.input]}
          placeholder="About"
          numberOfLines={10}
          multiline
          onChangeText={(text) => {
            setAudioInfo({ ...audioInfo, about: text });
          }}
        />
        <CategorySelector
          visible={showCategoryModal}
          onRequestClose={() => setShowCategoryModal(false)}
          title="Category"
          data={categories}
          renderItem={(item) => {
            return <Text style={styles.category}>{item}</Text>;
          }}
          onSelect={(item) => {
            setAudioInfo({ ...audioInfo, category: item });
          }}
        />
        <View style={{ marginBottom: 20 }} />
        <AppButton title="Submit" onPress={handleUpload} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  fileContainer: {
    flexDirection: "row",
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    color: colors.CONTRAST,
  },
  category: {
    padding: 10,
    color: colors.PRIMARY,
    fontSize: 18,
  },
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  categorySelectorTitle: {
    color: colors.CONTRAST,
  },
  selectedCategory: {
    color: colors.SECONDARY,
    fontStyle: "italic",
    marginLeft: 5,
  },
});

export default Upload;

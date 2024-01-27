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

interface Props {}

const Upload: FC<Props> = (props) => {
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [audioInfo, setAudioInfo] = useState({category: "" });

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
          options={{type: [types.images] }}
          onSelect={(file) => {
            console.log(file)
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
          options={{type: [types.audio]}}
          onSelect={(file) => {
            console.log(file)
          }}
        />
      </View>
      <View style={styles.formContainer}>
        <TextInput
          placeholderTextColor={colors.INACTIVE_CONTRAST}
          style={styles.input}
          placeholder="Title"
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
            setAudioInfo({ category: item });
          }}
        />
        <View style={{ marginBottom: 20 }} />
        <AppButton title="Submit" />
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
    color:colors.PRIMARY,
    fontSize:18
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

import colors from "@utils/colors";
import React, { FC, ReactNode } from "react";
import { ViewStyle } from "react-native";
import { Pressable, StyleProp, StyleSheet, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";


interface Props {
  icon?: ReactNode;
  btnTitle?: string;
  style?: StyleProp<ViewStyle>;
  onSelect(file: DocumentPicker.DocumentPickerAsset): void;
  options: DocumentPicker.DocumentPickerOptions;
}

const FileSelector: FC<Props> = ({
  icon,
  btnTitle,
  style,
  onSelect,
  options,
}) => {
  const handleDocumentSelect = async () => {
    try {
      const docRes = await DocumentPicker.getDocumentAsync(options);
      const assets = docRes.assets;
      if (!assets) return;
      const file = assets[0];
      onSelect(file);
    } catch (error) {
      console.log("Error while selecting file: ", error);
    }
    const document = await DocumentPicker.getDocumentAsync();
    console.log(document);
  };

  return (
    <Pressable
      onPress={handleDocumentSelect}
      style={[styles.btnContainer, style]}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.btnTitle}>{btnTitle}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
  btnContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    height: 70,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  btnTitle: {
    color: colors.CONTRAST,
    marginTop: 5,
  },
});

export default FileSelector;

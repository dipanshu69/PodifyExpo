import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {}

const Upload: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Text>Upload</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Upload;

import colors from "@utils/colors";
import React, { FC, useState } from "react";
import {
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface Props<T> {
  data: T[];
  visible?: boolean;
  title: string;
  renderItem(item: T): JSX.Element;
  onSelect(item: T, index: number): void;
  onRequestClose?(): void;
}

const CategorySelector = <T extends any>({
  visible = false,
  title,
  data,
  renderItem,
  onSelect,
  onRequestClose,
}: Props<T>) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (item: T, index: number) => {
    setSelectedIndex(index);
    onSelect(item, index);
    onRequestClose && onRequestClose();
  };

  return (
    <Modal onRequestClose={onRequestClose} visible={visible} transparent>
      <View style={styles.modelContainer}>
        <Pressable onPress={onRequestClose} style={styles.backDrop} />
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <ScrollView>
            {data.map((item, index) => {
              return (
                <Pressable
                  onPress={() => handleSelect(item, index)}
                  key={index}
                  style={styles.selectorContainer}
                >
                  {selectedIndex === index ? (
                    <MaterialCommunityIcons
                      name="radiobox-marked"
                      color={colors.SECONDARY}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="radiobox-blank"
                      color={colors.SECONDARY}
                    />
                  )}

                  {renderItem(item)}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backDrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.INACTIVE_CONTRAST,
    zIndex: -1,
  },
  modelContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  modal: {
    width: "90%",
    height: "45%",
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.CONTRAST,
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    color: colors.PRIMARY,
    paddingVertical: 10,
  },
  selectorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default CategorySelector;

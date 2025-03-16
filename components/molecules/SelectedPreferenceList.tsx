import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SelectedPreferenceListProps {
  title: string;
  items: Array<{ _id: string; title: string; imageUrl: string }>;
  onAddPress: () => void;
}

const SelectedPreferenceList: React.FC<SelectedPreferenceListProps> = ({
  title,
  items,
  onAddPress,
}) => {
  return (
    <View className="mb-6 rounded-xl bg-gray-50 p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="font-cairo-semibold text-lg text-[#0D0F0F]">{title}</Text>
        <TouchableOpacity
          className="h-8 w-8 items-center justify-center rounded-full bg-gray-200"
          onPress={onAddPress}>
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap">
        {items.length > 0 ? (
          items.map((item) => (
            <View
              key={item._id}
              className="mb-2 mr-2 flex-row items-center overflow-hidden rounded-lg bg-black">
              <Image source={{ uri: item.imageUrl }} className="h-10 w-10" />
              <Text className="px-3 font-cairo-semibold text-sm text-white">
                {item.title.toUpperCase()}
              </Text>
            </View>
          ))
        ) : (
          <Text className="font-cairo text-sm italic text-gray-500">
            No {title.toLowerCase()} selected yet
          </Text>
        )}
      </View>
    </View>
  );
};

export default SelectedPreferenceList;

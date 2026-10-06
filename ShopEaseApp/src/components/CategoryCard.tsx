import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  variant?: 'circle' | 'square';
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  variant = 'circle',
}) => {
  if (variant === 'square') {
    return (
      <TouchableOpacity style={styles.squareCard} onPress={onPress} activeOpacity={0.85}>
        <View style={styles.squareImageWrapper}>
          <Image source={{ uri: category.image }} style={styles.squareImage} resizeMode="cover" />
        </View>
        <Text style={styles.squareTitle} numberOfLines={1}>
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.circleContainer} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.circleIconBg, { backgroundColor: category.bg || '#E8EAF6' }]}>
        <Image source={{ uri: category.image }} style={styles.circleImage} resizeMode="cover" />
      </View>
      <Text style={styles.circleTitle} numberOfLines={1}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circleContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  circleIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  circleImage: {
    width: '100%',
    height: '100%',
  },
  circleTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D3436',
    marginTop: 6,
    textAlign: 'center',
  },
  squareCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 8,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  squareImageWrapper: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F8F9FA',
  },
  squareImage: {
    width: '100%',
    height: '100%',
  },
  squareTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 8,
  },
});

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Banner as BannerType } from '../types';

interface BannerProps {
  banner: BannerType;
  onPress?: () => void;
}

export const Banner: React.FC<BannerProps> = ({ banner, onPress }) => {
  return (
    <TouchableOpacity style={styles.bannerCard} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.contentLeft}>
        <Text style={styles.titleText}>{banner.title}</Text>
        <Text style={styles.subtitleText}>{banner.subtitle}</Text>
        <View style={styles.buttonBadge}>
          <Text style={styles.buttonText}>{banner.buttonText}</Text>
        </View>
      </View>
      <View style={styles.imageRight}>
        <Image source={{ uri: banner.image }} style={styles.bannerImage} resizeMode="cover" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bannerCard: {
    height: 140,
    backgroundColor: '#9C88FF',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 10,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  contentLeft: {
    flex: 1.2,
    justifyContent: 'center',
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitleText: {
    color: '#F1F2F6',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 10,
  },
  buttonBadge: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageRight: {
    flex: 0.9,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
  },
});

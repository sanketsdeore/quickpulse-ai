import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { JSX } from 'react'
import { Article } from "../api/gnews";

type Props = {
    article: Article;
    onPress: () => void;
};

const NewsCard = ({ article, onPress }: Props): JSX.Element  => {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {article.image && (
        <Image
        source={{uri: article.image}}
        style={styles.image}
        />
      )}
      <Text style={styles.title}>{article.title}</Text>
    </Pressable>
  )
};

export default NewsCard

const styles = StyleSheet.create({
    card: {
      marginBottom: 16,
      backgroundColor: "white",
      borderRadius: 12,
      overflow: "hidden",
      elevation: 2,
      padding: 10
    },
    image: {
      height: 180,
      borderRadius: 12,
      marginBottom: 8
    },
    title: {
      fontWeight: 'bold',
      fontSize: 18,
      paddingLeft: 2
    }
})
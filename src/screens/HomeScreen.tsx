import { ActivityIndicator, Button, FlatList, Image, Linking, Modal, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { JSX, useEffect, useState } from 'react'
import { Article, fetchNews } from '../api/gnews'
import NewsCard from '../components/NewsCard';
import { summarizeArticle } from '../api/summarize';
import { RefreshControl, TextInput } from 'react-native-gesture-handler';

const HomeScreen = (): JSX.Element => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');

  const categories = [
    'general',
    'business',
    'entertainment',
    'health',
    'science',
    'sports',
    'technology'
  ]

  useEffect(() => {
    const loadNews = async () => {
        const data = await fetchNews();
        setArticles(data);
        setLoading(false);
    };
    loadNews();
  }, [selectedCategory]);

  const handlePress = async (article: Article) => {
    setSelectedArticle(article);
    setLoadingSummary(true);
    setModalVisible(true);

    const content = article.content || article.description || article.title;
    const result = await summarizeArticle(content);

    setSummary(result);
    setLoadingSummary(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const data = await fetchNews(selectedCategory);
    console.log('Fetched news count:', data.length);
    setArticles([...data]);
    setRefreshing(false);
  };

  const openFullArticle = (url: string) => {
    Linking.openURL(url).catch(err => {
      console.error("Couldn't load page", err);
    })
  };

  const handleSearch = async () => {
    setLoading(true);
    const data = await fetchNews(searchQuery.trim());
    setArticles(data);
    setLoading(false);
  };

  if (loading) {
    return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#007AFF"/>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder='Search News'
          placeholderTextColor= "#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => handleSearch()}
          style={styles.searchInput}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((cat) => (
          <Text
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            {cat.toUpperCase()}
          </Text>
        ))}
      </ScrollView>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
            <NewsCard article={item} onPress={() => handlePress(item)}/>
        )}
        refreshControl={
          <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors= {["#007AFF"]}
          />
        }
      />
      <Modal visible={modalVisible} transparent animationType='slide'>
        <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
                {loadingSummary ? (
                    <ActivityIndicator size={"large"}/>
                ): (
                    <>
                        <ScrollView style={{ maxHeight: '95%' }} showsVerticalScrollIndicator={true}>
                            <Text style={styles.modalTitle}>AI Quick Read</Text>
                            {selectedArticle?.title && (
                                <View style={styles.highlightTitleBox}>
                                    <Text style={styles.title}>{selectedArticle.title}</Text>
                                </View>
                            )}
                            <View style={styles.modalText}>
                                {renderSummaryText(summary)}
                            </View>
                        </ScrollView>
                        <View style={ styles.buttons }>
                            <Button title="Read Full Article" onPress={() => openFullArticle(selectedArticle?.url || '')}/>
                            <Button title="Close" onPress={() => setModalVisible(false)} />
                        </View>
                    </>
                )}
            </View>
        </View>
      </Modal>
    </View>
  );
};

const renderSummaryText = (text: string) => {
  const bulletPoints = text.split('\n');

  return bulletPoints.map((line, index) => {
    if (!line.trim()) return null;

    const match = line.match(/^[•\-]?\s*(.*)/);
    if (!match) return null;

    const sentence = match[1].trim();

    if (sentence.includes(':')) {
      const [boldPart, ...rest] = sentence.split(':');
      return (
        <View key={index} style={{ marginBottom: 10 }}>
          <Text style={styles.bold}>• {boldPart.trim()}</Text>
          <Text style={styles.modalText}>{rest.join(':').trim()}</Text>
        </View>
      );
    }

    const words = sentence.split(' ');
    const boldPart = words.slice(0, 3).join(' ');
    const rest = words.slice(3).join(' ');

    return (
      <View key={index} style={{ marginBottom: 10 }}>
        <Text style={styles.bold}>• {boldPart}</Text>
        <Text style={styles.modalText}>{rest}</Text>
      </View>
    );
  });
};


export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#a5b1c2',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000aa',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalText: {
    marginBottom: 16,
  },
  bold: {
    fontSize: 14,
    fontWeight: '500'
  },
  highlightTitleBox: {
    backgroundColor: '#2980b9',
    padding: 8,
    elevation: 10,
    shadowColor: '#0f2e42',
    marginBottom: 14
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    textTransform: 'uppercase',
    color: '#ffffff'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 16
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 10
  },
  categoryButton: {
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 8,
    paddingTop: 6,
    borderRadius: 4,
    backgroundColor: '#dfe6e9',
    color: '#2d3436',
    fontWeight: '500',
    fontSize: 15
  },
  selectedCategory: {
    backgroundColor: '#2980b9',
    color: '#fff'
  },
  searchContainer: {
    
  },
  // searchIcon: {
    
  // }
})
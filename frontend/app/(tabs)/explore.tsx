import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getnewslist" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.resultCode === 200) {
          setItems(data.data);
          console.log(data.data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(items)
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>sodonews</Text>
      </View>

      {/* Top News */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Улс төр</Text>
        <FlatList
          data={items.slice(0, 5)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <Image
                source={{ uri: item.image_url || 'https://via.placeholder.com/300x180' }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.news_title}</Text>
                <Text style={styles.cardDescription}>{item.huraangvi}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Trending News */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Тренд мэдээнүүд</Text>
        <FlatList
          data={items.slice(5, 10)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <Image
                source={{ uri: item.image_url || 'https://via.placeholder.com/300x180' }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.news_title}</Text>
                <Text style={styles.cardDescription}>{item.huraangvi}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      {/* Trending News */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Шинэ содон</Text>
        <FlatList
          data={items.slice(11, 20)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <Image
                source={{ uri: item.image_url || 'https://via.placeholder.com/300x180' }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.news_title}</Text>
                <Text style={styles.cardDescription}>{item.huraangvi}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ангилал</Text>
        <View style={styles.categories}>
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryText}>Спорт</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryText}>Технологи</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryText}>Улс төр</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 10,
  },
  header: {
    backgroundColor: '#9b59b6',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  hear: {
    backgroundColor: '#9b59b6',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#5d3fd3',
  },
  card: {
    backgroundColor: '#f8f8f8',
    marginRight: 15,
    borderRadius: 8,
    overflow: 'hidden',
    width: 300,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  categoryCard: {
    backgroundColor: '#9b59b6',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

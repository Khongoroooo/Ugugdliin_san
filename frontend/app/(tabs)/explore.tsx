import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ad = {
  id: 1,
  image: 'https://media.tenor.com/ZZFQEc-67xYAAAAM/surprised-sorprendido.gif',
  text: '🎉 Emart цочир хямдрал 9999₮ 🎉',
};

const StarRating = ({ rating, onRatingChange }: { rating: number, onRatingChange: (rating: number) => void }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.starContainer}>
      {stars.map((star) => (
        <TouchableOpacity key={star} onPress={() => onRatingChange(star)}>
          <Text style={star <= rating ? styles.filledStar : styles.emptyStar}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const calculateAverageRating = (ratings: number[]) => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((a, b) => a + b, 0);
  return sum / ratings.length;
};

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [usdRate, setUsdRate] = useState('Loading...');
  const translateX = useRef(new Animated.Value(width)).current;

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
        }
      })
      .catch((err) => console.log(err));

    fetchExchangeRate();
    startScrolling();
  }, []);

  const fetchExchangeRate = async () => {
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      const json = await response.json();
      const mnt = json.rates.MNT;
      setUsdRate(`1$ = ${mnt}₮`);
    } catch (error) {
      console.error(error);
      setUsdRate('Алдаа');
    }
  };

  const startScrolling = () => {
    translateX.setValue(width);
    Animated.timing(translateX, {
      toValue: -width,
      duration: 12000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      startScrolling();
    });
  };

  const handleRatingChange = (itemId: number, newRating: number) => {
    const updatedItems = items.map((item: any) => {
      if (item.id === itemId) {
        const updatedRatings = item.ratings ? [...item.ratings, newRating] : [newRating];
        return { ...item, ratings: updatedRatings };
      }
      return item;
    });
    setItems(updatedItems);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#9b59b6', '#e056fd']} style={styles.header}>
        <View>
          <Text style={styles.headerText}>sodonews</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>{usdRate}</Text>
          </View>
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Нэвтрэх</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Бүртгүүлэх</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Scrolling Ad */}
      <View style={styles.adContainer}>
        <Animated.View style={[styles.adContent, { transform: [{ translateX }] }]}>
          <Image source={{ uri: ad.image }} style={styles.adImage} />
          <Text style={styles.adText}>{ad.text}</Text>
        </Animated.View>
      </View>

      {/* Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Улс төр</Text>
        <FlatList
          data={items.slice(0, 5)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }: any) => (
            <TouchableOpacity style={styles.card}>
              <Image
                source={{ uri: item.image_url || 'https://via.placeholder.com/300x180' }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.news_title}</Text>
                <Text style={styles.cardDescription}>{item.huraangvi}</Text>
                <StarRating
                  rating={calculateAverageRating(item.ratings || [])}
                  onRatingChange={(rating) => handleRatingChange(item.id, rating)}
                />
                <Text style={styles.cardRating}>
                  {calculateAverageRating(item.ratings || []).toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Тренд мэдээнүүд</Text>
        <FlatList
          data={items.slice(5, 10)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }: any) => (
            <TouchableOpacity style={styles.card}>
              <Image
                source={{ uri: item.image_url || 'https://via.placeholder.com/300x180' }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.news_title}</Text>
                <Text style={styles.cardDescription}>{item.huraangvi}</Text>
                <StarRating
                  rating={calculateAverageRating(item.ratings || [])}
                  onRatingChange={(rating) => handleRatingChange(item.id, rating)}
                />
                <Text style={styles.cardRating}>
                  {calculateAverageRating(item.ratings || []).toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Шинэ содон</Text>
        <FlatList
          data={items.slice(10, 20)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }: any) => (
            <TouchableOpacity style={styles.card}>
              <Image
                source={{ uri: item.image_url || 'https://via.placeholder.com/300x180' }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.news_title}</Text>
                <Text style={styles.cardDescription}>{item.huraangvi}</Text>
                <StarRating
                  rating={calculateAverageRating(item.ratings || [])}
                  onRatingChange={(rating) => handleRatingChange(item.id, rating)}
                />
                <Text style={styles.cardRating}>
                  {calculateAverageRating(item.ratings || []).toFixed(1)}
                </Text>
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingVertical: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  infoRow: { marginTop: 5 },
  infoText: { color: '#fff', fontSize: 12 },
  headerButtons: { flexDirection: 'row', gap: 10 },
  headerButton: { backgroundColor: '#ffffff40', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20 },
  headerButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  adContainer: { height: 70, overflow: 'hidden', backgroundColor: '#ffffff', justifyContent: 'center' },
  adContent: { flexDirection: 'row', alignItems: 'center' },
  adImage: { width: 60, height: 60, marginHorizontal: 10, borderRadius: 8 },
  adText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  section: { marginVertical: 20, paddingHorizontal: 15 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#9b59b6' },
  card: { backgroundColor: '#f8e8ff', marginRight: 15, borderRadius: 12, overflow: 'hidden', width: 280, elevation: 3 },
  cardImage: { width: '100%', height: 180 },
  cardContent: { padding: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#5d3fd3' },
  cardDescription: { fontSize: 14, color: '#777', marginTop: 5 },
  cardRating: { fontSize: 14, fontWeight: 'bold', color: '#FFD700', marginTop: 10 },
  starContainer: { flexDirection: 'row', marginTop: 5 },
  filledStar: { color: '#FFD700', fontSize: 20 },
  emptyStar: { color: '#D3D3D3', fontSize: 20 },
  categories: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  categoryCard: { backgroundColor: '#9b59b6', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  categoryText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

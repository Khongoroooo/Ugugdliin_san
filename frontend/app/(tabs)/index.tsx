import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Easing,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const ad = {
  id: 1,
  image: "https://media.tenor.com/ZZFQEc-67xYAAAAM/surprised-sorprendido.gif",
  text: "🎉 Emart цочир хямдрал 9999₮ 🎉",
};

const StarRating = ({ rating, onRatingChange }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.starContainer}>
      {stars.map((star) => (
        <TouchableOpacity key={star} onPress={() => onRatingChange(star)}>
          <Text style={star <= rating ? styles.filledStar : styles.emptyStar}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const calculateAverageRating = (ratings) => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((a, b) => a + b, 0);
  return sum / ratings.length;
};

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [usdRate, setUsdRate] = useState("Loading...");
  const translateX = useRef(new Animated.Value(width)).current;
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const t = await AsyncStorage.getItem("token");
      setToken(t);
      console.log(`############ token: ${t}`);
    };
    fetchToken();
  }, []);
  
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
    startScrolling();
  }, []);


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

  const handleRatingChange = (itemId, newRating) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        const updatedRatings = item.ratings
          ? [...item.ratings, newRating]
          : [newRating];
        return { ...item, ratings: updatedRatings };
      }
      return item;
    });
    setItems(updatedItems);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <LinearGradient colors={["#9b59b6", "#e056fd"]} style={styles.header}>
        <Text style={styles.headerText}>SodoNews</Text>
        <Text style={styles.infoText}>{usdRate}</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Хайх"
            placeholderTextColor="#999"
          />
          <View style={styles.headerButtons}>
            {token != null ? (
              // Хэрвээ token байгаа бол — Гарах товч
              <TouchableOpacity
                onPress={async () => {
                  await AsyncStorage.removeItem("token");
                  router.replace("/explore");
                }}
                style={styles.headerButton}
              >
                <Text style={styles.headerButtonText}>Гарах</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => router.push("/LoginScreen")}
                  style={styles.headerButton}
                >
                  <Text style={styles.headerButtonText}>Нэвтрэх</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push("/RegisterScreen")}
                  style={styles.headerButton}
                >
                  <Text style={styles.headerButtonText}>Бүртгүүлэх</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Scrolling Ad */}
      <View style={styles.adContainer}>
        <Animated.View
          style={[styles.adContent, { transform: [{ translateX }] }]}
        >
          <Image source={{ uri: ad.image }} style={styles.adImage} />
          <Text style={styles.adText}>{ad.text}</Text>
        </Animated.View>
      </View>

      {/* News Cards */}
      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image
              source={{
                uri: item.image_url || "https://via.placeholder.com/300x180",
              }}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 20, paddingTop: 40 },
  headerText: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  infoText: { color: "#f0f0f0", marginTop: 5 },
  searchContainer: { marginTop: 15 },
  searchBar: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 14,
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  headerButton: {
    backgroundColor: "#ffffff30",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  headerButtonText: { color: "#fff", fontWeight: "bold" },
  adContainer: {
    height: 70,
    overflow: "hidden",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  adContent: { flexDirection: "row", alignItems: "center" },
  adImage: { width: 50, height: 50, marginHorizontal: 10, borderRadius: 10 },
  adText: { fontSize: 16, fontWeight: "bold", color: "#000" },
  card: {
    backgroundColor: "#fdfbff",
    borderRadius: 16,
    marginRight: 15,
    width: 260,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  cardImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#2c2c2c" },
  cardDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
    lineHeight: 18,
  },
  cardRating: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#FFD700",
    marginTop: 8,
  },
  starContainer: { flexDirection: "row", marginTop: 5, gap: 4 },
  filledStar: { color: "#FFD700", fontSize: 18 },
  emptyStar: { color: "#D3D3D3", fontSize: 18 },
});

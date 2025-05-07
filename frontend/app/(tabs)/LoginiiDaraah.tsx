// HomeScreen.tsx

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
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

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
  const [cat, setcat] = useState([]);
  const [usdRate, setUsdRate] = useState("Loading...");
  const [token, setToken] = useState<string | null>(null);
  const translateX = useRef(new Animated.Value(width)).current;

  const panelAnim = useRef(new Animated.Value(-width * 0.3)).current;
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  const togglePanel = () => {
    if (isPanelVisible) {
      Animated.timing(panelAnim, {
        toValue: -width * 0.3,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsPanelVisible(false));
    } else {
      setIsPanelVisible(true);
      Animated.timing(panelAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const closePanel = () => {
    if (isPanelVisible) {
      Animated.timing(panelAnim, {
        toValue: -width * 0.3,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsPanelVisible(false));
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      const t = await AsyncStorage.getItem("token");
      setToken(t);
    };
    fetchToken();

    fetch("http://127.0.0.1:8000/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getnews" }),
    })
      .then((res) => res.json())
      .then((data) => data.resultCode === 200 && setItems(data.data))
      .catch(console.log);

    fetch("http://127.0.0.1:8000/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getcategory" }),
    })
      .then((res) => res.json())
      .then((data) => data.resultCode === 200 && setcat(data.data))
      .catch(console.log);

    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        setUsdRate(`USD rate: ${data.rates.MNT}₮`);
      })
      .catch(console.log);

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
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/736x/e5/50/f4/e550f43df6534b6132b77c8e9f0ca585.jpg",
      }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {isPanelVisible && (
        <TouchableWithoutFeedback onPress={closePanel}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.sidePanel, { left: panelAnim }]}>
        <ImageBackground
          source={{
            uri: "https://i.pinimg.com/736x/dd/d9/c6/ddd9c66350a75ebab6a587c09592d4e4.jpg",
          }}
          style={styles.sidePanelBackground}
          imageStyle={{ borderRadius: 0 }}
          blurRadius={0}
        >
          <Text style={styles.searchHeader}>🔍 Хайлт</Text>
          <TextInput placeholder="Мэдээ хайх..." style={styles.searchInput} />
          <TouchableOpacity onPress={closePanel} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </ImageBackground>
      </Animated.View>

      <ScrollView style={styles.container}>
        <LinearGradient colors={["#9b59b6", "#e056fd"]} style={styles.header}>
          <View style={styles.leftControls}>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/ProfileScreen")}
              style={styles.profileIconContainer}
            >
              <Ionicons name="person-circle-outline" size={40} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePanel} style={styles.searchIcon}>
              <Ionicons name="search" size={26} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>ꌗꂦꀸꂦ ꈤꍟꅏꌗ</Text>
            <Text style={styles.infoText}>{usdRate}</Text>
          </View>
        </LinearGradient>

        <View style={styles.adContainer}>
          <Animated.View
            style={[styles.adContent, { transform: [{ translateX }] }]}
          >
            <Image source={{ uri: ad.image }} style={styles.adImage} />
            <Text style={styles.adText}>{ad.text}</Text>
          </Animated.View>
        </View>

        <Text style={styles.sectionTitle}>Улс төрийн мэдээ</Text>

        <FlatList
          data={items.filter((item) => item.catid === 2)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/NewsDetailScreen?id=${item.id}`)}
            >
              <ImageBackground
                source={{
                  uri: item.image_url || "https://via.placeholder.com/300x180",
                }}
                style={styles.cardImage}
                imageStyle={{
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.6)", "transparent"]}
                  style={styles.imageOverlay}
                />
              </ImageBackground>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.news_title}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.huraangvi}
                </Text>
                <StarRating
                  rating={calculateAverageRating(item.ratings || [])}
                  onRatingChange={(rating) =>
                    handleRatingChange(item.id, rating)
                  }
                />
                <Text style={styles.cardRating}>
                  {calculateAverageRating(item.ratings || []).toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftControls: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginLeft: 10,
  },
  searchIcon: {
    paddingTop: 6,
  },
  profileIconContainer: {},
  headerTextContainer: { flex: 1, alignItems: "center" },
  headerText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  infoText: { color: "#e0e0e0", marginTop: 4, fontSize: 13 },
  adContainer: {
    height: 60,
    backgroundColor: "transparent",
    justifyContent: "center",
    marginTop: 10,
    overflow: "hidden",
    paddingHorizontal: 10,
  },
  adContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  adImage: { width: 45, height: 45, marginRight: 10, borderRadius: 8 },
  adText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 14,
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 16,
    width: 260,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  cardImage: { width: "100%", height: 150 },
  cardContent: { padding: 12 },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  cardDescription: { fontSize: 13, color: "#777", lineHeight: 18 },
  cardRating: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#f1c40f",
    marginTop: 6,
  },
  starContainer: { flexDirection: "row", marginTop: 6, gap: 4 },
  filledStar: { color: "#f1c40f", fontSize: 18 },
  emptyStar: { color: "#ccc", fontSize: 18 },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sidePanel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "30%",
    maxWidth: 450,
    minWidth: 300,
    backgroundColor: "transparent",
    zIndex: 999,
  },
  sidePanelBackground: {
    flex: 1,
    padding: 10,
    justifyContent: "flex-start",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 998,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  searchHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});

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
  const [usdRate, setUsdRate] = useState("Loading...");
  const [token, setToken] = useState<string | null>(null);
  const translateX = useRef(new Animated.Value(width)).current;

  // Хоёр panel-ийн төлөв
  const searchPanelAnim = useRef(new Animated.Value(-width)).current;
  const profilePanelAnim = useRef(new Animated.Value(width)).current;
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  const toggleSearchPanel = () => {
    if (isSearchVisible) {
      Animated.timing(searchPanelAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsSearchVisible(false));
    } else {
      setIsSearchVisible(true);
      Animated.timing(searchPanelAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const toggleProfilePanel = () => {
    if (isProfileVisible) {
      Animated.timing(profilePanelAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsProfileVisible(false));
    } else {
      setIsProfileVisible(true);
      Animated.timing(profilePanelAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeAllPanels = () => {
    if (isSearchVisible) {
      Animated.timing(searchPanelAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsSearchVisible(false));
    }
    if (isProfileVisible) {
      Animated.timing(profilePanelAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsProfileVisible(false));
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
      {(isSearchVisible || isProfileVisible) && (
        <TouchableWithoutFeedback onPress={closeAllPanels}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* 🔍 Search Panel */}
      <Animated.View
        style={[
          styles.sidePanel,
          { transform: [{ translateX: searchPanelAnim }] },
        ]}
      >
        <ImageBackground
          source={{
            uri: "https://i.pinimg.com/736x/dd/d9/c6/ddd9c66350a75ebab6a587c09592d4e4.jpg",
          }}
          style={styles.sidePanelBackground}
        >
          <Text style={styles.searchHeader}>🔍 Хайлт</Text>
          <TextInput placeholder="Мэдээ хайх..." style={styles.searchInput} />
          <TouchableOpacity onPress={closeAllPanels} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </ImageBackground>
      </Animated.View>

      {/* 👤 Profile Panel */}
<Animated.View
  style={[
    styles.sidePanel,
    {
      right: 0,
      position: "absolute",
      transform: [{ translateX: profilePanelAnim }],
    },
  ]}
>
  <ImageBackground
    source={{
      uri: "https://i.pinimg.com/736x/56/4a/f1/564af10f06689e733b685c3ee0192f52.jpg",
    }}
    style={styles.sidePanelBackground}
    imageStyle={{ borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}
  >
    <TouchableOpacity onPress={closeAllPanels} style={styles.closeButton}>
      <Ionicons name="close" size={26} color="black" />
    </TouchableOpacity>

    <View style={styles.profileContainer}>
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: "https://i.pinimg.com/736x/91/29/20/9129206728f2d87fba809749099803c7.jpg",
          }}
          style={styles.avatar}
        />
        <Text style={styles.profileName}>Нэр: Rose</Text>
        <Text style={styles.profileEmail}>
          Email: amay_iin_ireeduin_ehner@gmail.com
        </Text>

        <TouchableOpacity
          onPress={() => {
            AsyncStorage.removeItem("token");
            closeAllPanels();
            router.replace("/(tabs)/LoginiiDaraah");
          }}
        >
          <LinearGradient
            colors={["#9b59b6", "#e056fd"]}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>Гарах</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  </ImageBackground>
</Animated.View>



      <ScrollView style={styles.container}>
        <LinearGradient colors={["#9b59b6", "#e056fd"]} style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerText}>ꌗꂦꀸꂦ ꈤꍟꅏꌗ</Text>
            <Text style={styles.infoText}>{usdRate}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={toggleProfilePanel} style={styles.iconBtn}>
              <Ionicons name="person-circle-outline" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleSearchPanel} style={styles.iconBtn}>
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
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
          data={items.filter((item) => item.cat_id === 1)}
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

        <Text style={styles.sectionTitle}>Урлаг соёл</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 2)}
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
        <Text style={styles.sectionTitle}>Эдийн засаг</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 3)}
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
        <Text style={styles.sectionTitle}>Нийгэм</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 4)}
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
        <Text style={styles.sectionTitle}>Спорт</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 5)}
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
        <Text style={styles.sectionTitle}>Технологи</Text>

        <FlatList
          data={items.filter((item) => item.cat_id ===6)}
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
        <Text style={styles.sectionTitle}>Дэлхий дахинд</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 7)}
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
        <Text style={styles.sectionTitle}>Боловсрол</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 8)}
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
        <Text style={styles.sectionTitle}>Эрүүл мэнд</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 9)}
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
        <Text style={styles.sectionTitle}>Соёл уламжлал</Text>

        <FlatList
          data={items.filter((item) => item.cat_id === 10)}
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
  headerLeft: { flex: 1 },
  headerText: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  infoText: { color: "#e0e0e0", marginTop: 4, fontSize: 13 },
  headerRight: { flexDirection: "row", gap: 10 },
  iconBtn: { padding: 4 },
  adContainer: {
    height: 60,
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
    width: "70%",
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
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 20,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 4,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
});

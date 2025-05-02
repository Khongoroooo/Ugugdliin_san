import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  View,
  Image,
  Animated,
  TouchableOpacity,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  Surface,
  Provider as PaperProvider,
  DefaultTheme,
  MD3DarkTheme,
  Menu,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [huraangvi, setHuraangvi] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [catArray, setCatArray] = useState<string[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isNightMode, setIsNightMode] = useState(false);

  const colorScheme = useColorScheme();
  const theme = isNightMode
    ? {
        ...MD3DarkTheme,
        colors: { ...MD3DarkTheme.colors, background: "#121212" },
      }
    : {
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, background: "#FFFFFF" },
      };

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getnewslist" }),
    })
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.data
          .filter((e: any) => e.category_name !== null)
          .map((e: any) => e.category_name);
        setCatArray([...new Set(filtered)]);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!title || !content || !huraangvi || !categoryName) {
      alert("Бүх талбарыг бөглөнө үү.");
      return;
    }

    fetch("http://127.0.0.1:8000/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add_news",
        news_title: title,
        content: content,
        huraangvi: huraangvi,
        categoryName: categoryName,
        image_url: imageUri ?? "https://example.com/default.jpg",
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setSuccessMessage("Амжилттай бүртгэгдлээ!");
        setTitle("");
        setContent("");
        setHuraangvi("");
        setCategoryName("");
        setImageUri(null);
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((error) => {
        console.error(error);
        alert("Мэдээ илгээхэд алдаа гарлаа.");
      });
  };

  return (
    <PaperProvider theme={theme}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <ScrollView contentContainerStyle={{ padding: 20, gap: 20, flexGrow: 1 }}>
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <Surface
              style={{
                flex: 1,
                padding: 20,
                elevation: 4,
                justifyContent: "center",
                backgroundColor: theme.colors.background,
                // borderRadius: 12,
              }}
            >
              <TextInput
                label="Гарчиг"
                mode="outlined"
                value={title}
                onChangeText={setTitle}
                style={{ marginBottom: 10 }}
              />
              <TextInput
                label="Хураангүй"
                mode="outlined"
                value={huraangvi}
                onChangeText={setHuraangvi}
                style={{ marginBottom: 10 }}
              />
              <TextInput
                label="Агуулга"
                mode="outlined"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={5}
                style={{ marginBottom: 10 }}
              />

              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <TextInput
                      label="Төрөл сонгох"
                      value={categoryName}
                      mode="outlined"
                      editable={false}
                      pointerEvents="none"
                      style={{ marginBottom: 10 }}
                    />
                  </TouchableOpacity>
                }
              >
                {catArray.map((cat, index) => (
                  <Menu.Item
                    key={index}
                    onPress={() => {
                      setCategoryName(cat);
                      setMenuVisible(false);
                    }}
                    title={cat}
                  />
                ))}
              </Menu>

              <Button mode="outlined" icon="image" onPress={pickImage}>
                Зураг сонгох
              </Button>
              {imageUri && (
                <Image
                  source={{ uri: imageUri }}
                  style={{
                    width: "100%",
                    height: 200,
                    marginTop: 10,
                    // borderRadius: 10,
                  }}
                />
              )}
              <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 20 }}>
                Хадгалах
              </Button>
              {successMessage ? (
                <Text style={{ color: "green", marginTop: 10, textAlign: "center" }}>
                  {successMessage}
                </Text>
              ) : null}
            </Surface>
          </Animated.View>
        </ScrollView>

        {/* Night mode товчийг баруун доод буланд */}
        <Button
          mode="contained"
          onPress={() => setIsNightMode(!isNightMode)}
          style={{
            position: "absolute",
            bottom: 30,
            right: 20,
            padding: 5,
            minWidth: 50,
            minHeight: 50,
            zIndex: 999,
          }}
        >
          {isNightMode ? "🌙" : "🌞"}
        </Button>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

// Санал болгосон сайжруулсан хувилбар
import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Image,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  Provider as PaperProvider,
  Menu,
  DefaultTheme,
  MD3DarkTheme,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [huraangvi, setHuraangvi] = useState("");
  const [categoryName, setCategoryName] = useState({});
  const [catArray, setCatArray] = useState<string[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isNightMode, setIsNightMode] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isNightMode ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isNightMode]);

  const bgColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#1e1e1e"],
  });

  const textColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#000", "#FFF"],
  });

  const inputBg = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#f0f0f0", "#333333"],
  });

  const theme = isNightMode
    ? {
        ...MD3DarkTheme,
        colors: { ...MD3DarkTheme.colors, background: "#1e1e1e" },
      }
    : {
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, background: "#FFFFFF" },
      };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getcategory" }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCatArray(data.data);
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

  const handleSubmit = async () => {
    const requestBody = {
      action: "add_news",
      news_title: title,
      content: content,
      huraangvi: huraangvi,
      category_id: categoryName.catid,
      image_url: imageUri ?? "https://example.com/default.jpg",
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      setSuccessMessage("Амжилттай бүртгэгдлээ!");
      setTitle("");
      setContent("");
      setHuraangvi("");
      setCategoryName("");
      setImageUri(null);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Мэдээ илгээхэд алдаа гарлаа.");
    }
  };

  return (
    <PaperProvider theme={theme}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            {/* Input Fields */}
            {[["Гарчиг", title, setTitle], ["Хураангүй", huraangvi, setHuraangvi], ["Агуулга", content, setContent]].map(
              ([label, value, setter], i) => (
                <Animated.View
                  key={i}
                  style={[styles.inputContainer, { backgroundColor: inputBg }]}
                >
                  <AnimatedTextInput
                    label={label}
                    mode="flat"
                    value={value}
                    onChangeText={setter}
                    multiline={label === "Агуулга"}
                    numberOfLines={label === "Агуулга" ? 5 : 1}
                    style={[styles.textInput, { color: textColor }]}
                    underlineColor="transparent"
                    activeUnderlineColor="#9b59b6"
                  />
                </Animated.View>
              )
            )}

            {/* Dropdown */}
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                  <Animated.View style={[styles.inputContainer, { backgroundColor: inputBg }]}>
                    <AnimatedTextInput
                      value={categoryName.catname || "Төрөл сонгох"}
                      mode="flat"
                      editable={false}
                      pointerEvents="none"
                      style={[styles.textInput, { color: textColor }]}
                      underlineColor="transparent"
                    />
                  </Animated.View>
                </TouchableOpacity>
              }
            >
              {catArray.map((cat) => (
                <Menu.Item
                  key={cat.cat_id}
                  onPress={() => {
                    setCategoryName({ catid: cat.cat_id, catname: cat.category_name });
                    setMenuVisible(false);
                  }}
                  title={cat.category_name}
                />
              ))}
            </Menu>

            {/* Image Picker Button */}
            <LinearGradient colors={['#9b59b6', '#e056fd']} style={styles.gradientButton}>
              <Button
                icon="image"
                mode="contained"
                onPress={pickImage}
                textColor="#fff"
                style={{ backgroundColor: "transparent" }}
              >
                Зураг сонгох
              </Button>
            </LinearGradient>

            {/* Preview Image */}
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

            {/* Submit Button */}
            <LinearGradient colors={['#9b59b6', '#e056fd']} style={styles.gradientButton}>
              <Button
                mode="contained"
                onPress={handleSubmit}
                textColor="#fff"
                style={{ backgroundColor: "transparent" }}
              >
                Хадгалах
              </Button>
            </LinearGradient>

            {/* Success Message */}
            {successMessage && (
              <AnimatedText style={[styles.successMessage, { color: isNightMode ? "#90ee90" : "green" }]}>
                {successMessage}
              </AnimatedText>
            )}
          </ScrollView>

          {/* Night mode toggle */}
          <TouchableOpacity onPress={() => setIsNightMode(!isNightMode)} style={styles.toggleButton}>
            <AnimatedText style={styles.toggleText}>{isNightMode ? "🌙" : "🌞"}</AnimatedText>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 20,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  inputContainer: {
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  textInput: {
    backgroundColor: "transparent",
  },
  gradientButton: {
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 14,
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 15,
    resizeMode: "cover",
  },
  successMessage: {
    marginTop: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
  toggleButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 20,
    elevation: 2,
  },
  toggleText: {
    fontSize: 20,
  },
});

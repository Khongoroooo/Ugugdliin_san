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
  Surface,
  Provider as PaperProvider,
  Menu,
  DefaultTheme,
  MD3DarkTheme,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

// Animated хувилбарууд
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
    outputRange: ["#FFFFFF", "#2C2C2C"],
  });

  const textColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#000000", "#E0E0E0"],
  });

  const inputBg = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F5F5F5", "#333333"],
  });

  const buttonColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#6200ee", "#7f39fb"],
  });

  const theme = isNightMode
    ? {
        ...MD3DarkTheme,
        colors: { ...MD3DarkTheme.colors, background: "#2C2C2C" },
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
        // const listedCat = data.data.map((e) => e.category_id).filter(Boolean);
        // setCatArray([...new Set(listedCat)]);
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requestBody = {
      action: "add_news",
      news_title: title,
      content: content,
      huraangvi: huraangvi,
      category_id: categoryName.catid,
      image_url: imageUri ?? "https://example.com/default.jpg",
    };

    console.log(`###FORM: ${JSON.stringify( requestBody)}`)
    try {
      const response = await fetch("http://127.0.0.1:8000/user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log(JSON.stringify(data));
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
            <Surface style={styles.surface}>
              {/* Title */}
              <Animated.View
                style={[styles.inputContainer, { backgroundColor: inputBg }]}
              >
                <AnimatedTextInput
                  label="Гарчиг"
                  mode="flat"
                  value={title}
                  onChangeText={setTitle}
                  style={[styles.textInput, { color: textColor }]}
                  underlineColor="transparent"
                  activeUnderlineColor="#6200ee"
                />
              </Animated.View>

              {/* Summary */}
              <Animated.View
                style={[styles.inputContainer, { backgroundColor: inputBg }]}
              >
                <AnimatedTextInput
                  label="Хураангүй"
                  mode="flat"
                  value={huraangvi}
                  onChangeText={setHuraangvi}
                  style={[styles.textInput, { color: textColor }]}
                  underlineColor="transparent"
                  activeUnderlineColor="#6200ee"
                />
              </Animated.View>

              {/* Content */}
              <Animated.View
                style={[styles.inputContainer, { backgroundColor: inputBg }]}
              >
                <AnimatedTextInput
                  label="Агуулга"
                  mode="flat"
                  value={content}
                  onChangeText={setContent}
                  multiline
                  numberOfLines={5}
                  style={[styles.textInput, { color: textColor }]}
                  underlineColor="transparent"
                  activeUnderlineColor="#6200ee"
                />
              </Animated.View>

              {/* Dropdown */}
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Animated.View
                      style={[
                        styles.inputContainer,
                        { backgroundColor: inputBg },
                      ]}
                    >
                      
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
                      setCategoryName({
                        catid: cat.cat_id,
                        catname: cat.category_name,
                      });
                      setMenuVisible(false);
                    }}
                    title={cat.category_name}
                  />
                ))}
              </Menu>

              {/* Image Button */}
              <Animated.View style={styles.buttonContainer}>
                <Button icon="image" mode="outlined" onPress={pickImage}>
                  Зураг сонгох
                </Button>
              </Animated.View>

              {/* Preview Image */}
              {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.image} />
              )}

              {/* Submit Button */}
              <Animated.View
                style={[
                  styles.buttonContainer,
                  { backgroundColor: buttonColor, borderRadius: 8 },
                ]}
              >
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  textColor="#fff"
                >
                  Хадгалах
                </Button>
              </Animated.View>

              {/* Success message */}
              {successMessage ? (
                <AnimatedText
                  style={[
                    styles.successMessage,
                    { color: isNightMode ? "#90ee90" : "green" },
                  ]}
                >
                  {successMessage}
                </AnimatedText>
              ) : null}
            </Surface>
          </ScrollView>

          {/* Theme Toggle */}
          <TouchableOpacity
            onPress={() => setIsNightMode(!isNightMode)}
            style={styles.toggleButton}
          >
            <AnimatedText style={styles.toggleText}>
              {isNightMode ? "🌙" : "🌞"}
            </AnimatedText>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    paddingTop: 10,
    paddingBottom: 20,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  surface: {
    padding: 20,
    elevation: 4,
    backgroundColor: "transparent",
  },
  inputContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  textInput: {
    backgroundColor: "transparent",
  },
  buttonContainer: {
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 15,
    resizeMode: "cover",
  },
  successMessage: {
    marginTop: 10,
    textAlign: "center",
  },
  toggleButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    padding: 10,
    borderRadius: 25,
    zIndex: 999,
  },
  toggleText: {
    fontSize: 24,
  },
});

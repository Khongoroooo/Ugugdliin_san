import React, { useState, useEffect } from "react";
import * as DocumentPicker from "expo-document-picker";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
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
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [huraangvi, setHuraangvi] = useState("");
  const [categoryName, setCategoryName] = useState({});
  const [catArray, setCatArray] = useState<string[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isNightMode, setIsNightMode] = useState(false);
  const [hadgalah, setHadgalah] = useState(false);

  const theme = isNightMode ? MD3DarkTheme : DefaultTheme;

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
    });

    if (result.assets && result.assets.length > 0) {
      setFile(result.assets[0]);
    }
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

  const handleSubmit = async () => {
    setHadgalah(true);
    const formData = new FormData();

    if (file) {
      const response = await fetch(file.uri);
      const blob = await response.blob();
      formData.append("image_url", blob, file.name);
    }

    formData.append("action", "add_news");
    formData.append("news_title", title);
    formData.append("content", content);
    formData.append("huraangvi", huraangvi);
    formData.append("category_id", categoryName.catid);

    try {
      const res = await fetch("http://127.0.0.1:8000/user/", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      console.log(json);
      Alert.alert("Амжилттай!", "Мэдээлэл хадгалагдлаа");

      setTitle("");
      setContent("");
      setHuraangvi("");
      setCategoryName({});
      setFile(null);
      setHadgalah(false);
      setSuccessMessage("Амжилттай бүртгэгдлээ!");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.log(err);
      Alert.alert("Алдаа", "Сервертэй холбогдож чадсангүй");
      setHadgalah(false);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Title */}
          <TextInput
            label="Гарчиг"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            mode="outlined"
          />

          {/* Хураангуй */}
          <TextInput
            label="Хураангуй"
            value={huraangvi}
            onChangeText={setHuraangvi}
            style={styles.input}
            mode="outlined"
          />

          {/* Агуулга */}
          <TextInput
            label="Агуулга"
            value={content}
            onChangeText={setContent}
            style={styles.input}
            multiline
            numberOfLines={5}
            mode="outlined"
          />

          {/* Категори сонгох */}
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <TextInput
                  label="Төрөл сонгох"
                  value={categoryName.catname || ""}
                  style={styles.input}
                  mode="outlined"
                  editable={false}
                  pointerEvents="none"
                />
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

          {/* Зураг сонгох */}
          <LinearGradient
            colors={["#9b59b6", "#e056fd"]}
            style={styles.gradientButton}
          >
            <Button
              icon="image"
              mode="contained"
              onPress={pickFile}
              textColor="#fff"
              style={{ backgroundColor: "transparent" }}
            >
              Зураг сонгох
            </Button>
            <Text style={{ textAlign: "center", marginTop: 5 }}>
              {file ? file.name : "Файл сонгогдоогүй байна"}
            </Text>
          </LinearGradient>

          {/* Хадгалах */}
          <LinearGradient
            colors={["#9b59b6", "#e056fd"]}
            style={styles.gradientButton}
          >
            <Button
              mode="contained"
              onPress={handleSubmit}
              textColor="#fff"
              disabled={hadgalah}
              style={{ backgroundColor: "transparent" }}
            >
              {hadgalah ? "Хадгалж байна..." : "Хадгалах"}
            </Button>
          </LinearGradient>

          {/* Амжилттай мессеж */}
          {successMessage ? (
            <Text style={{ color: "green", marginTop: 10, textAlign: "center" }}>
              {successMessage}
            </Text>
          ) : null}

          {/* Night Mode Toggle */}
          <TouchableOpacity
            onPress={() => setIsNightMode(!isNightMode)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleText}>{isNightMode ? "🌙" : "🌞"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  input: {
    marginBottom: 12,
  },
  gradientButton: {
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 14,
    padding: 1,
  },
  toggleButton: {
    marginTop: 30,
    alignSelf: "center",
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 20,
    elevation: 2,
  },
  toggleText: {
    fontSize: 20,
  },
});

import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function HomeScreen() {
  const [catArray, setCatArray] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [huraangvi, setHuraangvi] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "getnewslist",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const filteredCategories = data.data
          .filter((e: any) => e.category_name !== null)
          .map((e: any) => e.category_name);

        const uniqueCategories = [...new Set(filteredCategories)];

        setCatArray(uniqueCategories);
      });
  }, []);

  console.log(`####### ${typeof catArray}`);
  function handleSubmit() {
    if (!title || !content || !huraangvi) {
      Alert.alert("Анхаар!", "Бүх талбарыг бөглөнө үү.");
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
        image_url: "https://example.com/zurag.jpg",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSuccessMessage("Амжилттай бүртгэгдлээ");
        setTitle("");
        setContent("");
        setHuraangvi("");
        setCategoryName("");
        setTimeout(() => setSuccessMessage(""), 3000); // 3 секундийн дараа арилгана
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Алдаа", "Мэдээ илгээхэд алдаа гарлаа.");
      });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* <TextInput
          style={styles.input}
          placeholder="Мэдээний төрөл сонгоно уу"
          value={categoryName}
          onChangeText={setCategoryName}
        /> */}
        <select
          style={styles.input}
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        >
          <option value="" disabled>
            Мэдээний төрөл сонгоно уу
          </option>
          {catArray.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <TextInput
          style={styles.input}  
          placeholder="Мэдээний гарчиг оруулна уу"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Мэдээний агуулга оруулна уу"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={5}
        />
        <TextInput
          style={styles.input}
          placeholder="Мэдээний хураангүй оруулна уу"
          value={huraangvi}
          onChangeText={setHuraangvi}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Хадгалах</Text>
        </TouchableOpacity>
        {successMessage ? (
          <Text style={styles.success}>{successMessage}</Text>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  success: {
    color: "green",
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
});

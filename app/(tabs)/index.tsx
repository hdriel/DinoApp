import { useEffect, useState } from "react";
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://dinoapi.brunosouzadev.com/api/dinosaurs";

interface Dinosaur {
  _id: string;
  name: string;
  image?: string;
}

export default function HomeScreen() {
  const [dinosaurs, setDinosaurs] = useState<Dinosaur[]>([]);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function fetchDinosaurs() {
      try {
        const response = await axios.get(API_URL);
        setDinosaurs(response.data);
      } catch (err: any) {
        setError("Failed to load dinosaurs.");
      }
    }
    fetchDinosaurs();
  }, []);

  const addToFavorites = async (dino: Dinosaur) => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      let favoritesArray = storedFavorites ? JSON.parse(storedFavorites) : [];

      // בדיקה אם הדינוזאור כבר קיים במועדפים
      if (!favoritesArray.some((item: any) => item.name === dino.name)) {
        favoritesArray.push({ name: dino.name });

        // שמירת הרשימה
        await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
        console.log("✅ Added to favorites:", JSON.stringify(favoritesArray, null, 2));
      } else {
        console.log("⚠️ Already in favorites:", dino.name);
      }
    } catch (error) {
      console.error("❌ Error saving favorite:", error);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>🦖 Dinosaur List</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={dinosaurs}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <View style={[styles.dinoContainer, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>

            {/* שם הדינוזאור */}
            <View style={styles.nameContainer}>
              <TouchableOpacity onPress={() => router.push(`/${encodeURI(item.name)}`)}>
                <Text style={styles.dinoName}>🦕 {item.name}</Text>
              </TouchableOpacity>
            </View>

            {/* כפתור Existed - באמצע */}
            <View style={styles.middleContainer}>
              <TouchableOpacity onPress={() => router.push(`/existed/${encodeURIComponent(item.name)}`)}>
                <Text style={styles.existedLink}>📅 Existed</Text>
              </TouchableOpacity>
            </View>

            {/* כפתור המועדפים */}
            <View style={styles.favoriteContainer}>
              <TouchableOpacity style={styles.favoriteButton} onPress={() => addToFavorites(item)}>
                <Text style={styles.favoriteButtonText}>💛</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}
      />

      {/* כפתור מעבר לעמוד המועדפים */}
      <TouchableOpacity style={styles.goToFavoritesButton} onPress={() => router.push("/favorites")}>
        <Text style={styles.goToFavoritesButtonText}>💖 מועדפים</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f8ff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  dinoContainer: {
    flexDirection: "row",
    alignItems: "center", // מבטיח שכל הרכיבים יהיו מיושרים אנכית
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 1 },
    elevation: 2,
  },
  nameContainer: {
    flex: 1, // שם הדינוזאור תופס שטח קבוע
  },
  middleContainer: {
    flex: 1, // כפתור Existed תופס שטח קבוע באמצע
    alignItems: "center", // ממקם אותו בדיוק באמצע
  },
  favoriteContainer: {
    flex: 1, // כפתור המועדפים תופס שטח קבוע
    alignItems: "flex-end", // ממקם אותו בצד ימין
  },
  dinoName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  existedLink: {
    fontSize: 16,
    color: "#007BFF",
    textDecorationLine: "underline",
    textAlign: "center", // מוודא שהתוכן מיושר באמצע
  },
  favoriteButton: {
    backgroundColor: "#FFD700", // ⭐ צבע צהוב זהב
    padding: 10,
    borderRadius: 50,
  },
  favoriteButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  rowEven: {
    backgroundColor: "#E0F7FA", // 💙 כחול בהיר
  },
  rowOdd: {
    backgroundColor: "#FFEBEE", // ❤️ ורוד בהיר
  },
  goToFavoritesButton: {
    backgroundColor: "#FF4081", // 💖 צבע ורוד
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  goToFavoritesButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});


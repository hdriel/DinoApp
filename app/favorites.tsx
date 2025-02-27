import { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        async function loadFavorites() {
            try {
                const storedFavorites = await AsyncStorage.getItem("favorites");
                console.log("🔍 Favorites Data from AsyncStorage:", storedFavorites);

                if (storedFavorites) {
                    setFavorites(JSON.parse(storedFavorites));
                }
            } catch (error) {
                console.error("❌ Error loading favorites:", error);
            } finally {
                setLoading(false);
            }
        }

        loadFavorites();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>💖 Favorite Dinosaurs</Text>
            {favorites.length === 0 ? (
                <Text style={styles.noFavorites}>No favorites yet! 🦖</Text>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item._id || item.name}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => router.push(`/${item.name.toLowerCase()}`)}>
                            <View style={styles.dinoContainer}>
                                <Image source={{ uri: item.image }} style={styles.image} />
                                <Text style={styles.name}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff5e6" }, // 🧡 צבע רקע חמים
    header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },
    dinoContainer: { alignItems: "center", marginBottom: 20, backgroundColor: "#ffffff", padding: 10, borderRadius: 10, elevation: 3 },
    image: { width: 150, height: 150, borderRadius: 10 },
    name: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 10 },
    noFavorites: { fontSize: 18, textAlign: "center", color: "gray" },
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});

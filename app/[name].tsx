import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";

const API_BASE_URL = "https://dinoapi.brunosouzadev.com/api/dinosaurs/";

export default function DinoDetails() {
    const { name } = useLocalSearchParams();
    const [dino, setDino] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!name || typeof name !== "string") {
            setError("Invalid dinosaur name");
            setLoading(false);
            return;
        }

        async function fetchDinoDetails() {
            try {
                console.log(`Fetching data for: ${name}`);
                const response = await axios.get(encodeURI(`${API_BASE_URL}${name}`));

                console.log("API Response Data:", response.data); // **בודק מה מתקבל מהשרת**

                // אם המידע הוא מערך, לוקחים את האובייקט הראשון
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setDino(response.data[0]);
                } else if (typeof response.data === "object") {
                    setDino(response.data);
                } else {
                    setError("No valid data available for this dinosaur");
                    setDino(null);
                }
            } catch (err: any) {
                setError("Error fetching dinosaur details");
                console.error("API Error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchDinoDetails();
    }, [name]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    if (!dino) {
        return <Text style={styles.error}>No data available</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {dino.image && <Image source={{ uri: dino.image }} style={styles.image} />}
            <Text style={styles.name}>{dino.name}</Text>
            <Text style={styles.info}><Text style={styles.bold}>Weight:</Text> {dino.weight ?? "N/A"}</Text>
            <Text style={styles.info}><Text style={styles.bold}>Height:</Text> {dino.height ?? "N/A"}</Text>
            <Text style={styles.info}><Text style={styles.bold}>Length:</Text> {dino.length ?? "N/A"}</Text>
            <Text style={styles.info}><Text style={styles.bold}>Diet:</Text> {dino.diet ?? "N/A"}</Text>
            <Text style={styles.info}><Text style={styles.bold}>Period:</Text> {dino.period ?? "N/A"}</Text>
            <Text style={styles.info}><Text style={styles.bold}>Existed:</Text> {dino.existed ?? "N/A"}</Text>
            <Text style={styles.info}><Text style={styles.bold}>Region:</Text> {dino.region ?? "N/A"}</Text>
            <Text style={styles.description}>{dino.description || "No description available"}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: "center",
        backgroundColor: "#f9f9f9",
    },
    image: {
        width: "90%", // שימוש ברוחב דינמי
        height: 300,  // גובה קבוע לכל התמונות
        borderRadius: 10,
        marginBottom: 10,
        resizeMode: "contain", // התמונה תשתלב יפה בלי להיחתך
    },
    name: {
        fontSize: 26,
        fontWeight: "bold",
        marginVertical: 10,
        textAlign: "center",
    },
    info: {
        fontSize: 18,
        marginVertical: 5,
        textAlign: "center",
    },
    bold: {
        fontWeight: "bold",
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        marginVertical: 10,
        paddingHorizontal: 15,
    },
    error: {
        color: "red",
        fontSize: 18,
        textAlign: "center",
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});


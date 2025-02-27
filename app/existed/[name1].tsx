import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";

const API_BASE_URL = "https://dinoapi.brunosouzadev.com/api/dinosaurs/";

export default function DinoExisted() {
    const { name1 } = useLocalSearchParams();
    const [dino, setDino] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!name1 || typeof name1 !== "string") {
            setError("Invalid dinosaur name");
            setLoading(false);
            return;
        }

        async function fetchDinoDetails() {
            try {
                console.log(`Fetching existence data for: ${name1}`);
                const response = await axios.get(`${API_BASE_URL}${encodeURIComponent(name1)}`);

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
    }, [name1]);

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
        <View style={styles.container}>
            <Text style={styles.name}>{dino.name}</Text>
            <Text style={styles.info}><Text style={styles.bold}>Existed:</Text> {dino.existed ?? "N/A"}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    name: {
        fontSize: 26,
        fontWeight: "bold",
        marginVertical: 10,
        textAlign: "center",
    },
    info: {
        fontSize: 20,
        marginVertical: 5,
        textAlign: "center",
    },
    bold: {
        fontWeight: "bold",
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

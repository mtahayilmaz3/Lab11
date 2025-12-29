import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import api from "../api/client";

export default function ProfileDetailScreen({ route }) {
  const { id } = route.params;
   if (!id) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Missing profile id.</Text>
      </View>
    );
  }

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const res = await api.get(`/profiles/${id}`);
      // defensive: server may return {data: {...}} or direct object
      const data = res.data?.data ?? res.data;
      setProfile(data);
    } catch (e) {
      setError(e?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ marginBottom: 10, textAlign: "center" }}>
          Error: {error}
        </Text>
        <TouchableOpacity
          onPress={fetchProfile}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 10,
            backgroundColor: "#111",
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Profile not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View
        style={{
          padding: 16,
          borderWidth: 1,
          borderColor: "#eee",
          borderRadius: 12,
          backgroundColor: "#fff",
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "700" }}>
          {profile.name ?? "Unnamed"}
        </Text>

        <Text style={{ marginTop: 10, color: "#555" }}>
          Email: {profile.email ?? "-"}
        </Text>

        <Text style={{ marginTop: 6, color: "#555" }}>
          Phone: {profile.phone ?? "-"}
        </Text>

        <Text style={{ marginTop: 6, color: "#555" }}>
          City: {profile.city ?? "-"}
        </Text>

        <Text style={{ marginTop: 6, color: "#555" }}>
          Company: {profile.company ?? "-"}
        </Text>

        <Text style={{ marginTop: 12, fontWeight: "600" }}>About</Text>
        <Text style={{ marginTop: 6, color: "#444", lineHeight: 20 }}>
          {profile.bio ?? "No bio."}
        </Text>
      </View>
    </ScrollView>
  );
}

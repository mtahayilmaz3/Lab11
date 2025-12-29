import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import api from "../api/client";

export default function ProfilesListScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false); // pagination loading
  const [initialLoading, setInitialLoading] = useState(true); // first load
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh

  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 10;

  const fetchProfiles = useCallback(
    async (pageToFetch = 1, mode = "append") => {
      try {
        setError(null);

        if (mode === "refresh") setRefreshing(true);
        else if (mode === "initial") setInitialLoading(true);
        else setLoading(true);

        const res = await api.get("/profiles", {
          params: { page: pageToFetch, limit: LIMIT },
        });

        // server response structure: adjust defensively
        const data = res.data?.data ?? res.data ?? [];
        const items = Array.isArray(data) ? data : data.items ?? [];

        setHasMore(items.length === LIMIT);

        if (mode === "append") {
          setProfiles((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const filtered = items.filter((p) => !existingIds.has(p.id));
            return [...prev, ...filtered];
          });
        } else {
          setProfiles(items);
        }

        setPage(pageToFetch);
      } catch (e) {
        setError(e?.message || "Failed to fetch profiles");
      } finally {
        setLoading(false);
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchProfiles(1, "initial");
  }, [fetchProfiles]);

  const loadMore = () => {
    if (loading || initialLoading || refreshing || !hasMore) return;
    fetchProfiles(page + 1, "append");
  };

  const onRefresh = () => {
    fetchProfiles(1, "refresh");
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ProfileDetail", { id: item.id })}
      style={{
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "600" }}>
        {item.name ?? "Unnamed"}
      </Text>
      <Text style={{ color: "#555", marginTop: 4 }}>
        {item.email ?? "No email"}
      </Text>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator />
      </View>
    );
  };

  const renderEmpty = () => {
    if (initialLoading) return null;
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <Text style={{ marginBottom: 10 }}>No profiles found.</Text>
        <TouchableOpacity
          onPress={() => fetchProfiles(1, "initial")}
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
  };

  if (initialLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>Loading profiles...</Text>
      </View>
    );
  }

  if (error && profiles.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ marginBottom: 10, textAlign: "center" }}>
          Error: {error}
        </Text>
        <TouchableOpacity
          onPress={() => fetchProfiles(1, "initial")}
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

  return (
    <FlatList
      data={profiles}
      keyExtractor={(item, index) => String(item.id ?? index)}
      renderItem={renderItem}
      onEndReached={loadMore}
      onEndReachedThreshold={0.4}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

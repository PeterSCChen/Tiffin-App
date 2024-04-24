import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App"; // Adjust the import path as needed
import { useNavigation } from "@react-navigation/native";
import { fetchAllProviders } from "../lib/dbProviders";
import { ExportProvider } from "../types/dbExportProviders";
const ProviderLogo = require("../assets/pureTiffin.png");

type NavigationProp = StackNavigationProp<RootStackParamList>;

function Provider() {
  const navigation = useNavigation<NavigationProp>();
  const [providers, setProviders] = useState<ExportProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching providers...");
    fetchAllProviders()
      .then((providersData) => {
        console.log("Providers fetched:", providersData);
        setProviders(providersData);
      })
      .catch((error) => {
        console.error("Error fetching providers:", error);
      });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {providers.map((provider) => (
        <TouchableOpacity
          key={provider.id}
          style={[
            styles.button,
            selectedProvider === provider.id
              ? styles.selectedButton
              : styles.unselectedButton,
          ]}
          onPress={() =>
            navigation.navigate("Main", {
              screen: "Plans",
              params: { provider: provider.id },
            })
          }
        >
          <View style={styles.contentWrapper}>
            <Image
              source={
                provider.imageUrl ? { uri: provider.imageUrl } : ProviderLogo
              }
              style={styles.buttonIcon}
              resizeMode="contain"
            />
            <View style={styles.textContainer}>
              <Text style={styles.buttonText}>{provider.name}</Text>
              <Text style={styles.descriptionText}>{provider.description}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10,
    width: "100%",
  },
  selectedButton: {
    borderColor: "#FFA500",
  },
  unselectedButton: {
    borderColor: "black",
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  buttonIcon: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: "column",
    flexShrink: 1,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    flexWrap: "wrap",
  },
  descriptionText: {
    fontSize: 16,
    flexWrap: "wrap",
  },
});

export default Provider;

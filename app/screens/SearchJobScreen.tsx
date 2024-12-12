import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from "react-native";
import * as Location from "expo-location"; // Import expo-location
import geolib, { getDistance } from "geolib"; // Import geolib for distance calculation

const jobData: Job[] = [
  {
    id: "1",
    title: "Software Engineer",
    company: "TechCorp",
    location: "New York, NY, USA",
    email: "hr@techcorp.com",
    latitude: 40.7128,
    longitude: -74.006,
    description: "Develop and maintain software applications.",
    skills: ["JavaScript", "React", "Node.js"],
  },
  {
    id: "2",
    title: "Frontend Developer",
    company: "WebSolutions",
    location: "San Francisco, CA, USA",
    email: "jobs@websolutions.com",
    latitude: 37.7749,
    longitude: -122.4194,
    description: "Work on frontend development and UI/UX design.",
    skills: ["HTML", "CSS", "React", "JavaScript"],
  },
  {
    id: "3",
    title: "Backend Developer",
    company: "DevWorks",
    location: "Remote",
    email: "careers@devworks.com",
    latitude: 0,
    longitude: 0,
    description: "Design and implement backend systems.",
    skills: ["Python", "Django", "SQL"],
  },
  {
    id: "4",
    title: "Mobile App Developer",
    company: "Sousse Tech Solutions",
    location: "Sousse, Tunisia",
    email: "recruit@soussetech.com",
    latitude: 35.8256,
    longitude: 10.6369,
    description: "Develop innovative mobile applications.",
    skills: ["React Native", "Java", "Swift"],
  },
  {
    id: "5",
    title: "Data Analyst",
    company: "AnalyticsPro",
    location: "Tunis, Tunisia",
    email: "jobs@analyticspro.com",
    latitude: 36.8065,
    longitude: 10.1815,
    description: "Analyze datasets to extract meaningful insights.",
    skills: ["Python", "SQL", "Tableau"],
  },
  {
    id: "6",
    title: "Machine Learning Engineer",
    company: "AI Labs",
    location: "Berlin, Germany",
    email: "careers@ailabs.de",
    latitude: 52.52,
    longitude: 13.405,
    description: "Develop and optimize machine learning models.",
    skills: ["Python", "TensorFlow", "PyTorch"],
  },
  {
    id: "7",
    title: "DevOps Engineer",
    company: "CloudWorks",
    location: "Paris, France",
    email: "hr@cloudworks.fr",
    latitude: 48.8566,
    longitude: 2.3522,
    description: "Implement and maintain CI/CD pipelines.",
    skills: ["Docker", "Kubernetes", "AWS"],
  },
  {
    id: "8",
    title: "Full Stack Developer",
    company: "MENA Innovators",
    location: "Dubai, UAE",
    email: "apply@mena-innovators.com",
    latitude: 25.276987,
    longitude: 55.296249,
    description: "Develop and maintain full-stack applications.",
    skills: ["Angular", "Node.js", "MongoDB"],
  },
  {
    id: "9",
    title: "Cybersecurity Specialist",
    company: "SecuriTech",
    location: "London, UK",
    email: "jobs@securitech.co.uk",
    latitude: 51.5074,
    longitude: -0.1278,
    description: "Ensure the security of IT systems and data.",
    skills: ["Ethical Hacking", "Firewall", "SIEM"],
  },
  {
    id: "10",
    title: "AI Researcher",
    company: "DeepMind",
    location: "Montreal, Canada",
    email: "careers@deepmind.ca",
    latitude: 45.5017,
    longitude: -73.5673,
    description: "Research advanced AI techniques and algorithms.",
    skills: ["Python", "AI", "Deep Learning"],
  },
  {
    id: "11",
    title: "Frontend Developer",
    company: "UI Experts",
    location: "Hammamet, Tunisia",
    email: "hr@uiexperts.com",
    latitude: 36.4011,
    longitude: 10.6168,
    description: "Design and implement modern UI/UX solutions.",
    skills: ["CSS", "JavaScript", "React"],
  },
  {
    id: "12",
    title: "Blockchain Developer",
    company: "CryptoWorld",
    location: "Zurich, Switzerland",
    email: "jobs@cryptoworld.ch",
    latitude: 47.3769,
    longitude: 8.5417,
    description: "Develop blockchain applications and smart contracts.",
    skills: ["Solidity", "Ethereum", "Hyperledger"],
  },
  {
    id: "13",
    title: "IT Support Technician",
    company: "Global IT Solutions",
    location: "Sousse, Tunisia",
    email: "support@globalit.tn",
    latitude: 35.8256,
    longitude: 10.6369,
    description: "Provide technical support for IT systems.",
    skills: ["Windows", "Linux", "Networking"],
  },
];

const SearchJobScreen = () => {
  const [userLocation, setUserLocation] = useState<any>(null);
  const [sortedJobs, setSortedJobs] = useState<Job[]>(jobData);
  const [userAddress, setUserAddress] = useState<string>("");

  // Fetch user location
  useEffect(() => {
    const fetchLocation = async () => {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied.");
        return;
      }

      // Get user's current location
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      // Reverse Geocoding to get city and country
      const address = await Location.reverseGeocodeAsync(location.coords);
      if (address.length > 0) {
        const { city, country } = address[0];
        setUserAddress(
          `${city || "Unknown City"}, ${country || "Unknown Country"}`
        );
      }
    };

    fetchLocation();
  }, []);

  // Sort jobs by location based on distance
  useEffect(() => {
    if (userLocation) {
      const sortedData = jobData
        .map((job) => {
          try {
            const distance = getDistance(
              {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              },
              { latitude: job.latitude, longitude: job.longitude }
            );
            return { ...job, distance };
          } catch (error) {
            console.error("Error calculating distance:", error);
            return { ...job, distance: Infinity }; // Assign a high value for jobs with issues
          }
        })
        .sort((a, b) => a.distance - b.distance);

      setSortedJobs(sortedData);
    }
  }, [userLocation]);

  // Handle email click
  const handleEmailClick = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Job Listings</Text>

        {userAddress ? (
          <Text style={styles.locationHeader}>
            Your location: {userAddress}
          </Text>
        ) : (
          <Text style={styles.locationHeader}>Fetching your location...</Text>
        )}
        <FlatList
          data={sortedJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listTile}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.company}>{item.company}</Text>
              <Text style={styles.location}>
                {item.location || "Location not specified"}
              </Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.skills}>
                Skills: {item.skills.join(", ")}
              </Text>
              <TouchableOpacity onPress={() => handleEmailClick(item.email)}>
                <Text style={styles.email}>Apply via Email: {item.email}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  locationHeader: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  listTile: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  company: {
    fontSize: 16,
    color: "#666",
  },
  location: {
    fontSize: 14,
    color: "#888",
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginVertical: 5,
  },
  skills: {
    fontSize: 14,
    color: "#444",
  },
  email: {
    fontSize: 14,
    color: "#007BFF",
    marginTop: 10,
  },
});

export default SearchJobScreen;

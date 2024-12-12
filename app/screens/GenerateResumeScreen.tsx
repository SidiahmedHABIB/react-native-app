import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { apiPost } from "./helper/api_manager";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const GenerateResumeScreen = () => {
  // State Management
  const [jobDescription, setJobDescription] = useState<string>("");
  const [generatedResume, setGeneratedResume] =
    useState<GenerateResumeData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<LoginResponse | null>(null);
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user"); // Get user data from AsyncStorage
        if (savedUser) {
          setUser(JSON.parse(savedUser)); // Parse and set the user data
        }
      } catch (error) {
        console.error("Error loading user data from AsyncStorage", error);
      }
    };

    loadUser(); // Load the user data on component mount
  }, []);

  // Animation Setup
  const fadeAnim = new Animated.Value(0);

  // Date Formatting Utility
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Resume Generation Handler
  const generateResume = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter a job description.");
      return;
    }

    setGeneratedResume(null); // Reset generated resume
    setLoading(true); // Set loading to true before API call
    try {
      const response = await apiPost<GenerateResumeData>("/resumes/generate", {
        userId: user?.userId, // Replace with actual userId
        jobDescription: jobDescription,
      });
      setGeneratedResume(response);
      setLoading(false); // Ensure loading is set to false after API call
    } catch (error) {
      alert("Error generating resume.");
      setLoading(false); // Ensure loading is set to false after API call

      console.error(error);
    } finally {
      setLoading(false); // Ensure loading is set to false after API call
    }
  };

  // Clear Resume Handler
  const clearResume = () => {
    setGeneratedResume(null);
    setJobDescription("");
  };

  // Loading Animation Effect
  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      fadeAnim.stopAnimation();
    }
  }, [loading]);

  // Skeleton Loader Component
  const skeletonLoader = (
    <View style={styles.skeletonContainer}>
      <Text style={styles.skeletonLoaderText}>
        Just a moment, we're preparing your perfect resume
      </Text>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) =>
        index % 2 == 0 ? (
          <Animated.View
            key={index}
            style={[
              styles.skeletonItem,
              {
                width: "100%",
                height: 20,
                opacity: fadeAnim,
              },
            ]}
          />
        ) : (
          <Animated.View
            key={index}
            style={[
              styles.skeletonItem,
              {
                width: "80%",
                height: 20,
                opacity: fadeAnim,
              },
            ]}
          />
        )
      )}
    </View>
  );

  // Render Method
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        enableOnAndroid
        extraScrollHeight={20}
      >
        <Text style={styles.headerTitle}>Generate Resume</Text>

        {loading ? (
          skeletonLoader
        ) : generatedResume ? (
          <ScrollView style={styles.resumeContainer}>
            <Text style={styles.sectionTitle}>Generated Resume</Text>

            {/* Contact Information */}
            <Text style={styles.resumeText}>
              Name: {generatedResume.fname} {generatedResume.lname}
            </Text>
            <Text style={styles.resumeText}>
              Email: {generatedResume.contact.email}
            </Text>
            <Text style={styles.resumeText}>
              Phone: {generatedResume.contact.phone}
            </Text>
            <Text style={styles.resumeText}>
              Location: {generatedResume.contact.location}
            </Text>
            {generatedResume.contact.linkedin && (
              <Text style={styles.resumeText}>
                LinkedIn: {generatedResume.contact.linkedin}
              </Text>
            )}
            {generatedResume.contact.github && (
              <Text style={styles.resumeText}>
                GitHub: {generatedResume.contact.github}
              </Text>
            )}

            {/* Profile */}
            <Text style={styles.resumeSubTitle}>Profile</Text>
            <Text style={styles.resumeText}>
              {generatedResume.profile.title}
            </Text>
            <Text style={styles.resumeText}>
              {generatedResume.profile.description}
            </Text>

            {/* Education */}
            <Text style={styles.resumeSubTitle}>Education</Text>
            {generatedResume.education.map((edu, index) => (
              <View key={index} style={styles.eduContainer}>
                <Text style={styles.resumeText}>
                  {edu.degree} in {edu.major}
                </Text>
                <Text style={styles.resumeText}>
                  {edu.university}, {edu.location}
                </Text>
                <Text style={styles.resumeText}>
                  ({formatDate(edu.startDate)} – {formatDate(edu.endDate)})
                </Text>
                {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                  <Text style={styles.resumeText}>
                    Relevant Courses: {edu.relevantCourses.join(", ")}
                  </Text>
                )}
              </View>
            ))}

            {/* Experience */}
            <Text style={styles.resumeSubTitle}>Experience</Text>
            {generatedResume.experience.map((exp, index) => (
              <View key={index} style={styles.expContainer}>
                <Text style={styles.resumeText}>
                  {exp.title} at {exp.company}
                </Text>
                <Text style={styles.resumeText}>{exp.location}</Text>
                <Text style={styles.resumeText}>
                  ({formatDate(exp.startDate)} – {formatDate(exp.endDate)})
                </Text>
                <Text style={styles.resumeText}>{exp.description}</Text>
                {exp.skills && exp.skills.length > 0 && (
                  <Text style={styles.resumeText}>
                    Skills: {exp.skills.join(", ")}
                  </Text>
                )}
              </View>
            ))}

            {/* Projects */}
            {generatedResume.projects &&
              generatedResume.projects.length > 0 && (
                <>
                  <Text style={styles.resumeSubTitle}>Projects</Text>
                  {generatedResume.projects.map((project, index) => (
                    <View key={index} style={styles.projectContainer}>
                      <Text style={styles.resumeText}>{project.title}</Text>
                      <Text style={styles.resumeText}>
                        {project.description}
                      </Text>
                      {project.technologies &&
                        project.technologies.length > 0 && (
                          <Text style={styles.resumeText}>
                            Technologies: {project.technologies.join(", ")}
                          </Text>
                        )}
                    </View>
                  ))}
                </>
              )}

            {/* Skills */}
            <Text style={styles.resumeSubTitle}>Skills</Text>
            <Text style={styles.resumeText}>
              Technical: {generatedResume.skills.technical.join(", ")}
            </Text>
            <Text style={styles.resumeText}>
              Tools: {generatedResume.skills.tools.join(", ")}
            </Text>
            <Text style={styles.resumeText}>
              Others: {generatedResume.skills.others.join(", ")}
            </Text>

            {/* Languages */}
            {generatedResume.languages &&
              generatedResume.languages.length > 0 && (
                <>
                  <Text style={styles.resumeSubTitle}>Languages</Text>
                  <Text style={styles.resumeText}>
                    {generatedResume.languages.join(", ")}
                  </Text>
                </>
              )}

            {/* Interests */}
            {generatedResume.interests &&
              generatedResume.interests.length > 0 && (
                <>
                  <Text style={styles.resumeSubTitle}>Interests</Text>
                  <Text style={styles.resumeText}>
                    {generatedResume.interests.join(", ")}
                  </Text>
                </>
              )}

            {/* Clear Button */}
            <TouchableOpacity style={styles.clearButton} onPress={clearResume}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <View style={styles.inputContainer}>
            <Text style={styles.sectionTitle}>Enter Job Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Paste the job description here"
              multiline
              numberOfLines={6}
              value={jobDescription}
              onChangeText={setJobDescription}
            />
            <TouchableOpacity style={styles.button} onPress={generateResume}>
              <Text style={styles.buttonText}>Generate Resume</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

// Comprehensive StyleSheet
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#007BFF",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 120,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    backgroundColor: "#e9ecef",
    textAlignVertical: "top",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resumeContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  resumeText: {
    fontSize: 16,
    color: "#495057",
    marginVertical: 5,
  },
  resumeSubTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  clearButton: {
    marginTop: 20,
    backgroundColor: "#dc3545",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  eduContainer: {
    marginBottom: 10,
  },
  expContainer: {
    marginBottom: 10,
  },
  projectContainer: {
    marginBottom: 10,
  },
  skeletonContainer: {
    width: "100%",
    padding: 20,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  skeletonLoaderText: {
    fontSize: 18,
    color: "#999999", // Soft gray color
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "400",
  },
  skeletonItem: {
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 10,
  },
});

export default GenerateResumeScreen;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Linking,
  Modal,
  Share,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

export default function JobBoard({ navigation }) {
  const [jobData, setJobData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetailsModalVisible, setJobDetailsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const DURHAM_REGIONS = [
    "Ajax",
    "Brock",
    "Clarington",
    "Oshawa",
    "Pickering",
    "Scugog",
    "Uxbridge",
    "Whitby",
  ];

  const fetchJobs = () => {
    return fetch("http://192.168.0.31:3000/api/jobs")
      .then((response) => response.json())
      .then((data) => {
        setJobData(data);
        setFilteredJobs(data);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetchJobs().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        const saved = await AsyncStorage.getItem("savedJobs");
        if (saved) {
          const savedJobs = JSON.parse(saved);
          setSavedJobIds(new Set(savedJobs.map((job) => job.id)));
        }
      } catch (e) {
        console.error("Failed to load saved jobs", e);
      }
    };
    loadSavedJobs();
  }, []);

  const toggleSave = async (item) => {
    try {
      const saved = await AsyncStorage.getItem("savedJobs");
      let savedJobs = saved ? JSON.parse(saved) : [];

      const existingIndex = savedJobs.findIndex((j) => j.id === item._id);

      if (existingIndex > -1) {
        savedJobs = savedJobs.filter((j) => j.id !== item._id);
      } else {
        savedJobs.push({
          id: item._id,
          title: item.job_title,
          employer: item.employer,
          url: item.url,
          skillMatch: "N/A",
          status: "Interested",
        });
      }

      await AsyncStorage.setItem("savedJobs", JSON.stringify(savedJobs));
      setSavedJobIds(new Set(savedJobs.map((job) => job.id)));
    } catch (e) {
      console.error("Failed to save job", e);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobData];

    if (selectedType) {
      filtered = filtered.filter((job) => job.type === selectedType);
    }
    if (selectedRegion) {
      filtered = filtered.filter((job) => job.region === selectedRegion);
    }
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.post_date) - new Date(a.post_date));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.post_date) - new Date(b.post_date));
    }

    setFilteredJobs(filtered);
    setFilterVisible(false);
  };

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedRegion(null);
    setSortBy(null);
    setFilteredJobs(jobData);
    setFilterVisible(false);
  };

  const handleShare = async (job) => {
    try {
      const result = await Share.share({
        message: `Check out this job opportunity: ${job.job_title}\n${job.url}`,
        title: `Share ${job.job_title} Position`,
        url: job.url,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      console.error("Error sharing:", error.message);
    }
  };

  const openJobDetails = (job) => {
    setSelectedJob(job);
    setJobDetailsModalVisible(true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs().finally(() => setRefreshing(false));
  };

  const renderJobCard = ({ item }) => {
    const formattedDate = new Date(item.post_date).toISOString().split("T")[0];
    const jobType = item.type === "PT" ? "Part Time" : "Full Time";
    const isSaved = savedJobIds.has(item._id);

    return (
      <TouchableOpacity
        style={styles.jobCard}
        onPress={() => openJobDetails(item)}
      >
        <Text style={styles.jobTitle}>{item.job_title}</Text>
        <Text style={styles.jobCompany}>{item.employer}</Text>
        <Text style={styles.jobDetails}>
          {formattedDate} · {item.region} · {jobType}
        </Text>
        <Text style={styles.jobDescription} numberOfLines={2}>
          {item.excerpt}
        </Text>
        <View style={styles.jobActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Linking.openURL(item.url).catch((err) =>
                console.error("Failed to open URL", err)
              )
            }
          >
            <View style={styles.buttonContent}>
              <Text style={styles.actionText}>Go to job post</Text>
              <Icon name="arrow-right" size={14} color="#fff" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, isSaved && styles.savedButton]}
            onPress={() => toggleSave(item)}
          >
            <View style={styles.buttonContent}>
              <Text style={[styles.actionText, isSaved && styles.savedText]}>
                {isSaved ? "Saved" : "Save job post"}
              </Text>
              <Icon
                name={isSaved ? "bookmark" : "bookmark-o"}
                size={14}
                color={isSaved ? "#649A47" : "#fff"}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleShare(item)}
          >
            <View style={styles.buttonContent}>
              <Icon name="share" size={14} color="#fff" />
              <Text style={styles.actionText}>Share</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const displayedJobs = filteredJobs.filter((job) =>
    job.job_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("./DWA-logo.png")} style={styles.logo} />
        <Text style={styles.title}>Jobs Board</Text>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon
            name="search"
            size={16}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search jobs..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Text style={styles.filterText}>
            Filters <Icon name="filter" size={14} color="#fff" />
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsBanner}>
        <Text style={styles.statsText}>
          {displayedJobs.length} {displayedJobs.length === 1 ? "job" : "jobs"}{" "}
          found
        </Text>
        {(selectedType || selectedRegion || sortBy) && (
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearAllText}>Clear all filters</Text>
          </TouchableOpacity>
        )}
      </View>

      <Animated.View
        style={styles.filterChipsContainer}
        layout={Layout.duration(200)}
      >
        {selectedType && (
          <Animated.View
            style={styles.filterChip}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            layout={Layout.duration(200)}
          >
            <Text style={styles.filterChipText}>
              {selectedType === "FT" ? "Full Time" : "Part Time"}
            </Text>
            <TouchableOpacity
              onPress={() => setSelectedType(null)}
              style={styles.filterChipClose}
            >
              <Icon name="times" size={12} color="#213E64" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {selectedRegion && (
          <Animated.View
            style={styles.filterChip}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            layout={Layout.duration(200)}
          >
            <Text style={styles.filterChipText}>{selectedRegion}</Text>
            <TouchableOpacity
              onPress={() => setSelectedRegion(null)}
              style={styles.filterChipClose}
            >
              <Icon name="times" size={12} color="#213E64" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {sortBy && (
          <Animated.View
            style={styles.filterChip}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            layout={Layout.duration(200)}
          >
            <Text style={styles.filterChipText}>
              {sortBy === "newest" ? "Newest First" : "Oldest First"}
            </Text>
            <TouchableOpacity
              onPress={() => setSortBy(null)}
              style={styles.filterChipClose}
            >
              <Icon name="times" size={12} color="#213E64" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>

      {loading ? (
        <ActivityIndicator size="large" color="#213E64" />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : (
        <FlatList
          data={displayedJobs}
          keyExtractor={(item) => item._id}
          renderItem={renderJobCard}
          contentContainerStyle={styles.jobList}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterVisible}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.filterTitle}>Filter Jobs</Text>

            <Text style={styles.filterLabel}>Job Type</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedType === "FT" && styles.selectedOption,
                ]}
                onPress={() => setSelectedType("FT")}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedType === "FT" && styles.selectedOptionText,
                  ]}
                >
                  Full Time
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedType === "PT" && styles.selectedOption,
                ]}
                onPress={() => setSelectedType("PT")}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedType === "PT" && styles.selectedOptionText,
                  ]}
                >
                  Part Time
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterLabel}>Region</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.regionScrollContainer}
            >
              {DURHAM_REGIONS.map((region) => (
                <TouchableOpacity
                  key={region}
                  style={[
                    styles.filterOption,
                    selectedRegion === region && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedRegion(region)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedRegion === region && styles.selectedOptionText,
                    ]}
                  >
                    {region}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.filterLabel}>Sort By</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  sortBy === "newest" && styles.selectedOption,
                ]}
                onPress={() => setSortBy("newest")}
              >
                <Text
                  style={[
                    styles.optionText,
                    sortBy === "newest" && styles.selectedOptionText,
                  ]}
                >
                  Newest
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  sortBy === "oldest" && styles.selectedOption,
                ]}
                onPress={() => setSortBy("oldest")}
              >
                <Text
                  style={[
                    styles.optionText,
                    sortBy === "oldest" && styles.selectedOptionText,
                  ]}
                >
                  Oldest
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <Text style={styles.buttonText}>Apply Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.buttonText}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Job Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={jobDetailsModalVisible}
        onRequestClose={() => setJobDetailsModalVisible(false)}
      >
        {selectedJob && (
          <View style={styles.jobDetailsModalContainer}>
            <View style={styles.jobDetailsModalContent}>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setJobDetailsModalVisible(false)}
              >
                <Icon name="close" size={24} color="#213E64" />
              </TouchableOpacity>

              <ScrollView contentContainerStyle={styles.jobDetailsScrollView}>
                <Text style={styles.jobDetailsTitle}>
                  {selectedJob.job_title}
                </Text>
                <Text style={styles.jobDetailsCompany}>
                  {selectedJob.employer}
                </Text>

                <View style={styles.jobDetailsInfoContainer}>
                  <View style={styles.jobDetailsInfoItem}>
                    <Icon name="calendar" size={16} color="#213E64" />
                    <Text style={styles.jobDetailsInfoText}>
                      Posted:{" "}
                      {new Date(selectedJob.post_date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.jobDetailsInfoItem}>
                    <Icon name="map-marker" size={16} color="#213E64" />
                    <Text style={styles.jobDetailsInfoText}>
                      {selectedJob.region}
                    </Text>
                  </View>
                  <View style={styles.jobDetailsInfoItem}>
                    <Icon name="briefcase" size={16} color="#213E64" />
                    <Text style={styles.jobDetailsInfoText}>
                      {selectedJob.type === "FT" ? "Full Time" : "Part Time"}
                    </Text>
                  </View>
                  <View style={styles.jobDetailsInfoItem}>
                    <Icon name="money" size={16} color="#213E64" />
                    <Text style={styles.jobDetailsInfoText}>
                      Annual Wage: $
                      {selectedJob.harmonized_wage || "Not specified"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.jobDetailsDescriptionTitle}>
                  Job Description
                </Text>
                <Text style={styles.jobDetailsDescription}>
                  {selectedJob.description || selectedJob.excerpt}
                </Text>

                {selectedJob.skill_names &&
                  selectedJob.skill_names.length > 0 && (
                    <>
                      <Text style={styles.jobDetailsDescriptionTitle}>
                        Required Skills
                      </Text>
                      <View style={styles.skillsContainer}>
                        {selectedJob.skill_names.map((skill, index) => (
                          <View key={index} style={styles.skillTag}>
                            <Text style={styles.skillTagText}>{skill}</Text>
                          </View>
                        ))}
                      </View>
                    </>
                  )}

                <View style={styles.jobDetailsActionsContainer}>
                  <TouchableOpacity
                    style={styles.jobDetailsApplyButton}
                    onPress={() =>
                      Linking.openURL(selectedJob.url).catch((err) =>
                        console.error("Failed to open URL", err)
                      )
                    }
                  >
                    <Text style={styles.jobDetailsApplyButtonText}>
                      Apply Now
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.jobDetailsShareButton}
                    onPress={() => handleShare(selectedJob)}
                  >
                    <Icon name="share" size={20} color="#fff" />
                    <Text style={styles.jobDetailsShareButtonText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white", // Changed back to white
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#213E64", // Original color
    paddingLeft: 55,
  },
  searchContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    gap: 5,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  searchIcon: {
    padding: 10,
    marginLeft: 5,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    paddingLeft: 0,
    fontSize: 14,
    color: "#213E64",
  },
  filterButton: {
    backgroundColor: "#213E64",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  filterText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  statsBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  statsText: {
    color: "#666",
    fontWeight: "500",
  },
  clearAllText: {
    color: "#213E64",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  jobList: {
    padding: 10,
  },
  jobCard: {
    backgroundColor: "#213E64",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  jobCompany: {
    fontSize: 14,
    color: "#cce4ff",
    marginVertical: 5,
  },
  jobDetails: {
    fontSize: 12,
    color: "#cce4ff",
  },
  jobDescription: {
    fontSize: 14,
    color: "#fff",
    marginVertical: 10,
  },
  jobActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },
  actionButton: {
    backgroundColor: "#0056b3",
    padding: 8,
    borderRadius: 5,
  },
  savedButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#649A47",
  },
  actionText: {
    fontSize: 12,
    color: "#fff",
  },
  savedText: {
    color: "#649A47",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: "column",
    gap: 10,
  },
  filterOption: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#649A47",
  },
  optionText: {
    color: "#333",
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "#fff",
  },
  regionScrollContainer: {
    flexDirection: "row",
    gap: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  applyButton: {
    backgroundColor: "#213E64",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  clearButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  jobDetailsModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  jobDetailsModalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  closeModalButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  jobDetailsScrollView: {
    paddingBottom: 20,
  },
  jobDetailsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#213E64",
    marginBottom: 5,
  },
  jobDetailsCompany: {
    fontSize: 16,
    color: "#649A47",
    marginBottom: 15,
  },
  jobDetailsInfoContainer: {
    flexDirection: "column",
    marginBottom: 15,
  },
  jobDetailsInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  jobDetailsInfoText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  jobDetailsDescriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#213E64",
    marginBottom: 10,
  },
  jobDetailsDescription: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 20,
  },
  jobDetailsActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  jobDetailsApplyButton: {
    backgroundColor: "#213E64",
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
  jobDetailsApplyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  jobDetailsShareButton: {
    backgroundColor: "#0056b3",
    flex: 1,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  jobDetailsShareButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 20,
  },
  skillTag: {
    backgroundColor: "#213E64",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  skillTagText: {
    color: "white",
    fontSize: 12,
  },
  filterChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    paddingBottom: 10,
    backgroundColor: "#fff",
    minHeight: 20,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    shadowColor: "#213E64",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterChipText: {
    color: "#213E64",
    fontSize: 12,
    fontWeight: "500",
  },
  filterChipClose: {
    marginLeft: 6,
    padding: 2,
    borderRadius: 10,
    backgroundColor: "rgba(33, 62, 100, 0.1)",
  },
  jobDetailsCompany: {
    fontSize: 16,
    color: "#649A47",
    marginBottom: 15,
  },
  jobDetailsInfoContainer: {
    flexDirection: "column",
    marginBottom: 15,
  },
  jobDetailsInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  jobDetailsInfoText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  jobDetailsDescriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#213E64",
    marginBottom: 10,
  },
  jobDetailsDescription: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 20,
  },
  jobDetailsActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  jobDetailsApplyButton: {
    backgroundColor: "#213E64",
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
  jobDetailsApplyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  jobDetailsShareButton: {
    backgroundColor: "#0056b3",
    flex: 1,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  jobDetailsShareButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 20,
  },
  skillTag: {
    backgroundColor: "#213E64",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  skillTagText: {
    color: "white",
    fontSize: 12,
  },
  filterChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    paddingBottom: 10,
    backgroundColor: "#fff",
    minHeight: 20,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    shadowColor: "#213E64",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterChipText: {
    color: "#213E64",
    fontSize: 12,
    fontWeight: "500",
  },
  filterChipClose: {
    marginLeft: 6,
    padding: 2,
    borderRadius: 10,
    backgroundColor: "rgba(33, 62, 100, 0.1)",
  },
});

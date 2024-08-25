import {
    View,
    StyleSheet,
    Image,
    FlatList,
    Text,
    Dimensions,
    Pressable,
  } from "react-native";
import { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { imageURL } from "@/services/ApiService";
  const HEIGHT = 225;
  const WIDTH = Dimensions.get("window").width;
  
  export default function Card({
    images,
    heading,
    subheading,
    onPress,
    style,
    ...rest
  }: {
    images: string[];
    heading: string;
    subheading: string | null;
    onPress?: () => any;
    style?: any;
  }) {
    const flatListRef = useRef<FlatList | null>(null);
    const viewConfigRef = { viewAreaCoveragePercentThreshold: 95 };
    const [activeIndex, setActiveIndex] = useState(0);
    const onViewRef = useRef(({ changed }: { changed: any }) => {
      if (changed[0].isViewable) {
        setActiveIndex(changed[0].index);
      }
    });

  
    return (
      <View style={[styles.cardContainer, style]} {...rest}>
        {/* Images */}
        <FlatList
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          ref={(ref) => (flatListRef.current = ref)}
          snapToAlignment="center"
          pagingEnabled
          viewabilityConfig={viewConfigRef}
          onViewableItemsChanged={onViewRef.current}
          renderItem={({ item }) => (
            <Pressable onPress={onPress} style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: imageURL + item }} />
            </Pressable>
          )}
        />
        {/*  Dot Container */}
        {images.length > 1 && (
          <View style={styles.dotContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  {
                    opacity: index === activeIndex ? 1 : 0.5,
                  },
                  styles.dot,
                ]}
              />
            ))}
          </View>
        )}
  
        {/* Text Container */}
        <Pressable onPress={onPress} style={styles.textContainer}>
          <Text style={styles.heading}>{heading}</Text>
          <Text style={styles.subheading}>${subheading}/night</Text>
        </Pressable>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    cardContainer: {
      borderWidth: 2,
      borderBlockColor: "grey",
      marginTop: 20,
      padding:20,
      width: WIDTH-50,
      borderRadius: 10,
    },
    
    imageContainer: { width: WIDTH - 60 },
    image: {
      width: "100%",
      height: HEIGHT,
      borderRadius: 10,
    },
    dotContainer: {
      position: "absolute",
      flexDirection: "row",
      justifyContent: "center",
      top: HEIGHT - 20,
      alignSelf: "center",
    },
    dot: {
      width: 5,
      height: 5,
      margin: 3,
      borderRadius: 30,
      backgroundColor: "white",
    },
    textContainer: { marginTop: 10 },
    heading: { fontSize: 20 },
    subheading: { fontSize: 18, marginTop: 5 },
  });
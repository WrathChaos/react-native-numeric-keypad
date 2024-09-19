import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("screen");

interface NumpadButtonProps {
  value: string;
  onPress: (value: string) => void;
}

const NumpadButton: React.FC<NumpadButtonProps> = ({ value, onPress }) => {
  if (value === "X") {
    return (
      <TouchableOpacity style={styles.button} onPress={() => onPress("X")}>
        <Image
          source={require("./local-assets/backspace-icon.png")}
          style={styles.backspaceIcon}
        />
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity style={styles.button} onPress={() => onPress(value)}>
      <Text style={styles.buttonText}>{value}</Text>
    </TouchableOpacity>
  );
};

const Numpad: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>(""); // State for input value

  const buttons: string[][] = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "X"],
  ];

  const handleButtonPress = (value: string) => {
    if (value === "X") {
      setInputValue((prev) => prev.slice(0, -1)); // Handle backspace
    } else {
      setInputValue((prev) => prev + value); // Append the button value to input
    }
  };

  const handleSlideToSend = () => {
    console.log("Slide to Send pressed with value:", inputValue);
    // Add your logic for sending the value here
  };

  return (
    <View style={styles.container}>
      {/* Input Area */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>{inputValue || "0"} USD</Text>
      </View>

      {/* Number Pad */}
      <View style={styles.numpadContainer}>
        <TouchableOpacity
          style={styles.slideButton}
          onPress={handleSlideToSend}
        >
          <Text style={styles.slideButtonText}>Confirm</Text>
          <Image
            source={require("./local-assets/arrow-right.png")}
            style={styles.arrowRight}
          />
        </TouchableOpacity>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((buttonValue) => (
              <NumpadButton
                key={buttonValue}
                value={buttonValue}
                onPress={handleButtonPress}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  inputContainer: {
    width: ScreenWidth,
    padding: ScreenWidth * 0.05,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  inputText: {
    fontSize: 42,
    color: "#F2994A", // Orange color similar to the one in the screenshot
    fontWeight: "600",
  },
  numpadContainer: {
    height: ScreenHeight * 0.45,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: ScreenWidth * 0.05,
    marginBottom: ScreenHeight * 0.05,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    width: ScreenWidth / 4 - 30,
    height: ScreenWidth / 4 - 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#828282",
  },
  slideButton: {
    height: 60,
    borderRadius: 16,
    backgroundColor: "#0c58af",
    width: ScreenWidth * 0.85,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  slideButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  backspaceIcon: {
    width: ScreenWidth * 0.08,
    height: ScreenWidth * 0.08,
    tintColor: "#828282",
  },
  arrowRight: {
    width: ScreenWidth * 0.05,
    height: ScreenWidth * 0.05,
    tintColor: "#FFFFFF",
    marginLeft: ScreenWidth * 0.02,
  },
});

export default Numpad;

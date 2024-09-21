import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("screen");

// Shared interface for style props
export interface NumpadStyleProps {
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  customBackspaceIcon?: React.ReactNode;
  PressableComponent?: React.ComponentType<any>;
}

interface NumpadButtonProps extends NumpadStyleProps {
  value: string;
  onPress: (value: string) => void;
}

export interface NumpadProps extends NumpadStyleProps {
  buttonText: string;
  onConfirmPress: (value: number) => void;
  currencyLocale?: string;
  numpadStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputTextStyle?: StyleProp<TextStyle>;
}

// **Updated numberFormat function**
export const numberFormat = (
  value: any,
  locale: string = "de-DE", // Changed from 'en-GB' to 'de-DE'
  options: any = {},
) => {
  const number = Number(value);
  if (isNaN(number)) {
    return "0";
  }
  return new Intl.NumberFormat(locale, options).format(number);
};

// **Updated formatInputValue function**
const formatInputValue = (input: string, locale: string) => {
  if (input === "") {
    return "0";
  }

  // **Replace multiple commas with a single comma**
  const sanitizedInput = input.replace(/,+/g, ",");

  // **Split the input into integer and decimal parts using ','**
  const parts = sanitizedInput.split(",");
  const { [0]: integerPart, [1]: decimalPart = "" } = parts;

  // **Format the integer part**
  const formattedInteger = numberFormat(integerPart, locale);

  // **Append the decimal part with ',' if it exists**
  if (parts.length > 1) {
    return decimalPart.length > 0
      ? `${formattedInteger},${decimalPart}`
      : `${formattedInteger},`;
  }

  return formattedInteger;
};

const NumpadButton: React.FC<NumpadButtonProps> = ({
  value,
  buttonStyle,
  buttonTextStyle,
  customBackspaceIcon,
  PressableComponent = TouchableOpacity,
  onPress,
}) => {
  if (value === "X") {
    return (
      <PressableComponent
        style={[styles.button, buttonStyle]}
        onPress={() => onPress("X")}
      >
        {customBackspaceIcon || (
          <Image
            source={require("./local-assets/backspace-icon.png")}
            style={styles.backspaceIcon}
          />
        )}
      </PressableComponent>
    );
  }

  if (value === ".") {
    return (
      <PressableComponent
        style={[styles.button, buttonStyle]}
        onPress={() => onPress(".")}
      >
        <Text style={[styles.buttonText, buttonTextStyle]}>{","}</Text>
      </PressableComponent>
    );
  }
  return (
    <PressableComponent
      style={[styles.button, buttonStyle]}
      onPress={() => onPress(value)}
    >
      <Text style={[styles.buttonText, buttonTextStyle]}>{value}</Text>
    </PressableComponent>
  );
};

const Numpad: React.FC<NumpadProps> = ({
  buttonText,
  buttonStyle,
  buttonTextStyle,
  customBackspaceIcon,
  onConfirmPress,
  numpadStyle,
  inputContainerStyle,
  inputTextStyle,
  currencyLocale = "en-GB",
  PressableComponent = TouchableOpacity,
}) => {
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
    } else if (value === ".") {
      // **Append ',' instead of '.'**
      if (!inputValue.includes(",")) {
        setInputValue((prev) => (prev === "" ? "0," : prev + ","));
      }
    } else {
      setInputValue((prev) => {
        // Prevent leading zeros
        if (prev === "0") {
          return value;
        }
        return prev + value;
      });
    }
  };

  const renderInputArea = () => (
    <View style={[styles.inputContainer, inputContainerStyle]}>
      <Text style={[styles.inputText, inputTextStyle]}>
        {formatInputValue(inputValue, currencyLocale)} USD
      </Text>
    </View>
  );

  const renderConfirmButton = () => (
    <PressableComponent
      style={styles.confirmButton}
      onPress={() => {
        // **Replace ',' with '.' before parsing**
        const numericValue = parseFloat(inputValue.replace(",", "."));
        if (!isNaN(numericValue)) {
          onConfirmPress(numericValue);
        } else {
          onConfirmPress(0);
        }
      }}
    >
      <Text style={styles.confirmButtonText}>{buttonText}</Text>
      <Image
        source={require("./local-assets/arrow-right.png")}
        style={styles.arrowRight}
      />
    </PressableComponent>
  );

  const renderNumPad = () => (
    <View style={[styles.numpadContainer, numpadStyle]}>
      {renderConfirmButton()}
      {buttons.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((buttonValue) => (
            <NumpadButton
              key={buttonValue}
              value={buttonValue}
              onPress={handleButtonPress}
              buttonStyle={buttonStyle}
              buttonTextStyle={buttonTextStyle}
              customBackspaceIcon={customBackspaceIcon}
            />
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderInputArea()}
      {renderNumPad()}
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
    color: "#F2994A",
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
  confirmButton: {
    height: 60,
    borderRadius: 16,
    backgroundColor: "#0c58af",
    width: ScreenWidth * 0.85,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  confirmButtonText: {
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

// Define your custom theme
import { extendTheme } from '@chakra-ui/react';
import { BackgroundColor, Green, Pink } from "./colors";

export const chakraTheme = extendTheme({
  colors: {
    dark: BackgroundColor,
    pink: {
      solid: Pink,
      hover: '#B82F4A',
      active: '#8A2337',
    },
    white: {
      solid: '#ffffff',
      hover: '#f2f2f2',
      active: '#b3b3b3',
    },
    green: {
      solid: Green,
      hover: '#12846b',
      active: '#0c5a4a',
    },
  },
  components: {
    Modal: {
      baseStyle: {
        dialog: {
          bg: 'dark',
          color: 'white',
        }
      }
    },
    Input: {
      defaultProps: {
        focusBorderColor: Green,
      },
      baseStyle: {
        field: {
          bg: 'dark',
          color: 'white',
          fontSize: "14px",
        }
      }
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: Green,
      },
      baseStyle: {
        field: {
          bg: 'dark',
          color: 'white',
          fontSize: "14px",
        }
      }
    },
    Select: {
      defaultProps: {
        focusBorderColor: Green,
      },
      baseStyle: {
        field: {
          bg: 'dark',
          color: 'white',
        }
      }
    },
    Heading: {
      baseStyle: {
        color: 'white',
      }
    },
    Text: {
      baseStyle: {
        color: 'white',
      }
    },
    Tr: {
      baseStyle: {
        color: 'white',
        _hover: {
          bg: 'red',
        },
      }
    },
    Td: {
      baseStyle: {
        color: 'white',
      }
    },
    FormLabel: {
      baseStyle: {
        color: 'white',
      }
    },
    Divider: {
      baseStyle: {
        borderColor: '#3f3f3f',
      },
      sizes: {
        md: {
          h: '0px',
          w: '100%',
        },
      },
      defaultProps: {
        size: 'md',
      },
    },
    Button: {
      baseStyle: {
        color: 'white',
      },
      variants: {
        solid: (props: Record<string, any>) => ({
          fontSize: '14px',
          bg: props.colorScheme === 'green' ? 'green.solid' : undefined,
          _hover: {
            bg: props.colorScheme === 'green' ? 'green.hover' : undefined,
          },
          _active: {
            bg: props.colorScheme === 'green' ? 'green.active' : undefined,
          },
        }),
        outlinedWhite: {
          bg: 'transparent',
          border: '1px solid',
          borderColor: 'white',
          borderRadius: '10px',
          fontSize: '14px',
          color: 'white',
          _hover: {
            bg: 'white.hover',
            color: 'dark',
            borderColor: 'white.hover',
          },
          _active: {
            bg: 'white.active',
            borderColor: 'white.active',
          },
        },
        outlinedPink: {
          bg: 'transparent',
          border: '1px solid',
          borderColor: Pink,
          borderRadius: '10px',
          fontSize: '14px',
          color: Pink,
          _hover: {
            bg: 'pink.hover',
            color: 'dark',
            borderColor: 'pink.hover',
          },
          _active: {
            bg: 'pink.active',
            borderColor: 'pink.active',
          },
        },
      },
    },
    Toast: {
      baseStyle: {
        container: {
          color: "white", // Change this to your desired color
        },
      },
    },
    Tabs: {
      parts: ['tablist', 'tab', 'tabpanel', 'indicator'],
      baseStyle: {
        tab: {
          borderBottom: "none", // Remove the bottom border from the tab
          textColor: "#D9D9D9",
          _selected: {
            textColor: "white",
            fontWeight: "bold",
          },
        },
      },
    }
  },
});

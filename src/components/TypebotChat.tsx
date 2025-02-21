import React, { useEffect } from 'react';

declare global {
  interface Window {
    Typebot: {
      initBubble: (config: {
        typebot: string;
        apiHost: string;
        previewMessage: {
          message: string;
          autoShowDelay: number;
        };
        theme: {
          button: {
            backgroundColor: string;
            customIconSrc: string;
            size: string;
          };
          chatWindow: {
            backgroundColor: string;
          };
        };
      }) => void;
    };
  }
}

export function TypebotChat() {
  useEffect(() => {
    const loadTypebot = async () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0.3.34/dist/web.js';
      script.type = 'module';
      script.onload = () => {
        window.Typebot?.initBubble({
          typebot: "demofftsite",
          apiHost: "https://viewer.faithflowtech.com.br",
          previewMessage: {
            message: "Eu tenho uma pergunta para você!",
            autoShowDelay: 10000,
          },
          theme: {
            button: {
              backgroundColor: "#666460",
              customIconSrc: "https://i.postimg.cc/4N07HNpP/onlychurch-fundo-laranja.png",
              size: "large",
            },
            chatWindow: {
              backgroundColor: "#fff"
            },
          },
        });
      };
      document.body.appendChild(script);
    };

    loadTypebot();

    return () => {
      const script = document.querySelector('script[src*="typebot.io"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
}
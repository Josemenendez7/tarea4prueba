/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';

const App = () => {
  
const MemoryGame = () => {
  const [cards, setCards] = useState<{ id: number; image: any; flipped: boolean }[]>([]);
  const [selectedCards, setSelectedCards] = useState<{ id: number; image: any; flipped: boolean }[]>([]);
  const [attempts, setAttempts] = useState<number>(0);

  const initializeGame = () => {
    // Crear una lista de cartas duplicada (dos veces cada carta)
    const allCards = [
      require('./imagenes/carta1.png'),
      require('./imagenes/carta2.png'),
      require('./imagenes/carta3.png'),
      require('./imagenes/carta4.png'),
      require('./imagenes/carta5.png'),
      require('./imagenes/carta6.png'),
      // ... Agregar las rutas de las imágenes de las cartas restantes
    ];

    const duplicatedCards = [...allCards, ...allCards];
    
    // Barajar las cartas al azar
    const shuffledCards = duplicatedCards.sort(() => Math.random() - 0.5);

    setCards(shuffledCards.map((card, index) => ({ id: index, image: card, flipped: false })));
  };

  const flipCard = (cardId: number): void => {
    setCards(prevCards => prevCards.map(card => 
      card.id === cardId ? { ...card, flipped: !card.flipped } : card
    ));
  };

  const checkMatch = (): void => {
    if (selectedCards.length === 2) {
      setAttempts(attempts + 1);

      if (selectedCards[0].image === selectedCards[1].image) {
        // Las cartas coinciden, déjalas descubiertas
        setSelectedCards([]);
      } else {
        // Las cartas no coinciden, voltea las cartas después de un breve retraso
        setTimeout(() => {
          setCards(prevCards => prevCards.map(card => 
            selectedCards.some(selectedCard => selectedCard.id === card.id) 
              ? { ...card, flipped: false } 
              : card
          ));
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  const handleCardPress = (cardId: number): void => {
    // Evitar seleccionar más de dos cartas a la vez
    if (selectedCards.length < 2 && !cards[cardId].flipped) {
      flipCard(cardId);
      setSelectedCards([...selectedCards, cards[cardId]]);
      checkMatch();
    }
  };

  const renderCard = (card: { id: number; image: any; flipped: boolean }): React.ReactNode => {
    const rotateY = card.flipped ? '0deg' : '180deg';
    const cardStyle = {
      transform: [{ rotateY }],
    };

    return (
      <Animated.View style={[styles.card, cardStyle]}>
        <Image source={card.flipped ? card.image : require('./imagenes/reves.png')} style={styles.cardImage} />
      </Animated.View>
    );
  };

  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.attemptsText}>Intentos: {attempts}</Text>
      <View style={styles.cardsContainer}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={styles.card}
            onPress={() => handleCardPress(card.id)}
            activeOpacity={0.7}
          >
            {renderCard(card)}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attemptsText: {
    fontSize: 20,
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: 80,
    height: 120,
    margin: 10,
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
  },
  cardImage: {
    width: 60,
    height: 90,
  },
});
}
export default App;

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const App = () => {
  const [cards, setCards] = useState<{ id: number; image: any; flipped: boolean }[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [attempts, setAttempts] = useState<number>(0);

  useEffect(() => {
    const initializeGame = () => {
      const allCards = [
        require('./imagenes/carta1.png'),
        require('./imagenes/carta2.png'),
        require('./imagenes/carta3.png'),
        require('./imagenes/carta4.png'),
        require('./imagenes/carta5.png'),
        require('./imagenes/carta6.png'),
      ];

      const duplicatedCards = [...allCards, ...allCards];
      const shuffledCards = duplicatedCards.sort(() => Math.random() - 0.5);

      setCards(shuffledCards.map((card, index) => ({ id: index, image: card, flipped: false })));
    };

    initializeGame();
  }, []);

  const flipCard = (cardId: number): void => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, flipped: !card.flipped } : card
      )
    );
  };

  const checkMatch = (): void => {
    if (selectedCards.length === 2) {
      setAttempts(attempts + 1);

      const [firstCardId, secondCardId] = selectedCards;

      if (cards[firstCardId].image === cards[secondCardId].image) {

        setSelectedCards([]);
      } else {

        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              selectedCards.includes(card.id)
                ? { ...card, flipped: false }
                : card
            )
          );
          setSelectedCards([]);
        }, 50);
      }
    }
  };

  const handleCardPress = (cardId: number): void => {
    if (selectedCards.length < 2 && !cards[cardId].flipped) {
  
      setSelectedCards((prevSelected) => [...prevSelected, cardId]);
      flipCard(cardId);


      if (selectedCards.length === 1) {
        checkMatch();
      }
    } else {

      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) =>
            selectedCards.includes(card.id)
              ? { ...card, flipped: false }
              : card
          )
        );
        setSelectedCards([]);
        flipCard(cardId);
      }, 50);
    }
  };

  const renderCard = (card: { id: number; image: any; flipped: boolean }): React.ReactNode => {
    return (
      <TouchableOpacity
        key={card.id}
        style={styles.cardContainer}
        onPress={() => handleCardPress(card.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.card, { transform: [{ rotateY: card.flipped ? '180deg' : '0deg' }] }]}>
          <Image
            source={card.flipped ? card.image : require('./imagenes/reves.png')}
            style={styles.cardImage}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.attemptsText}>Intentos: {attempts}</Text>
      <View style={styles.cardsContainer}>{cards.map(renderCard)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F08080', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  attemptsText: {
    fontSize: 20,
    marginBottom: 20,
    color: '#5F18ED', 
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardContainer: {
    margin: 10,
  },
  card: {
    width: 80,
    height: 120,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#2DC2BB', 
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
});

export default App;

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

const HomeScreen = () => {
  const [songs, setSongs] = useState([
    { id: '1', title: 'Blinding Lights', artist: 'The Weeknd' },
    { id: '2', title: 'Levitating', artist: 'Dua Lipa' },
    { id: '3', title: 'Stay', artist: 'Justin Bieber & The Kid LAROI' },
    { id: '4', title: 'Peaches', artist: 'Justin Bieber feat. Daniel Caesar & Giveon' },
    { id: '5', title: 'Watermelon Sugar', artist: 'Harry Styles' }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const soundRef = useRef(null);
  const [lastPlayedSong, setLastPlayedSong] = useState(null);

  const neverGonnaGiveYouUpUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  const loadSong = async () => {
    const { sound, status } = await Audio.Sound.createAsync(
      { uri: neverGonnaGiveYouUpUrl },
      { shouldPlay: false },
      onPlaybackStatusUpdate
    );
    setSound(sound);
    setDuration(status.durationMillis);
    setPosition(status.positionMillis);
  };

  const onPlaybackStatusUpdate = (status) => {
    setIsPlaying(status.isPlaying);
    setPosition(status.positionMillis);
    if (status.isLoaded) {
      setDuration(status.durationMillis);
    }
  };

  const openPlayer = async () => {
    setIsModalVisible(true);
    await loadSong();
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const restartSong = async () => {
    await sound.replayAsync();
    setPosition(0);
  };

  const closePlayer = () => {
    sound.unloadAsync();
    setIsModalVisible(false);
    setSelectedSong(null);
    setIsPlaying(false);
    setPosition(0);
  };

  const openProfile = () => {
    window.location.href = 'http://localhost:8081/perfil';
  };

  const renderSongItem = ({ item }) => (
    <View style={styles.songItem}>
      <Text style={styles.songTitle}>{item.title}</Text>
      <Text style={styles.artist}>{item.artist}</Text>
      <TouchableOpacity style={styles.playButton} onPress={openPlayer}>
        <Text style={styles.playButtonText}>Tocar</Text>
      </TouchableOpacity>
    </View>
  );

  const openLastPlayedSong = () => {
    openPlayer();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Músicas Pop Famosas</Text>
      <TouchableOpacity style={styles.profileButton} onPress={openProfile}>
        <Icon name="user" size={24} color="#fff" />
      </TouchableOpacity>

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={renderSongItem}
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closePlayer}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.songTitle}>Never Gonna Give You Up</Text>
            <Text style={styles.artist}>Rick Astley</Text>

            <Slider
              style={styles.slider}
              value={position}
              minimumValue={0}
              maximumValue={duration}
              onValueChange={async (value) => {
                setPosition(value);
                await sound.setPositionAsync(value);
              }}
            />
            
            <Text style={styles.playerText}>
              {isPlaying ? 'Tocando...' : 'Pausado'}
            </Text>
            
            <View style={styles.controls}>
              <TouchableOpacity onPress={restartSong} style={styles.controlButton}>
                <Text style={styles.controlButtonText}>Reiniciar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
                <Text style={styles.controlButtonText}>
                  {isPlaying ? 'Pausar' : 'Tocar'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closePlayer}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.musicButton}
        onPress={openPlayer}
      >
        <Text style={styles.musicButtonText}>Música</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffcc80',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  songItem: {
    backgroundColor: '#ff7043',
    padding: 15,
    marginBottom: 15,
    width: '80%',
    borderRadius: 12,
    shadowColor: '#ff5722',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  artist: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
  },
  playButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: '#ff5722',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  playButtonText: {
    color: '#ff7043',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  artist: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  playerText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  controlButton: {
    backgroundColor: '#ff7043',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#ff7043',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  musicButton: {
    backgroundColor: '#ff7043',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: [{ translateX: -50 }],
  },
  musicButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;

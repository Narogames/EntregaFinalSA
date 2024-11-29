import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Importando o ícone do Feather
import { Audio } from 'expo-av'; // Importando o módulo de áudio do Expo
import Slider from '@react-native-community/slider'; // Importando o Slider correto

const HomeScreen = () => {
  const [songs, setSongs] = useState([
    {
      id: '1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
    },
    {
      id: '2',
      title: 'Levitating',
      artist: 'Dua Lipa',
    },
    {
      id: '3',
      title: 'Stay',
      artist: 'Justin Bieber & The Kid LAROI',
    },
    {
      id: '4',
      title: 'Peaches',
      artist: 'Justin Bieber feat. Daniel Caesar & Giveon',
    },
    {
      id: '5',
      title: 'Watermelon Sugar',
      artist: 'Harry Styles',
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false); // Controle de visibilidade do modal
  const [selectedSong, setSelectedSong] = useState(null); // Música selecionada para reprodução
  const [sound, setSound] = useState(); // Controle do áudio
  const [isPlaying, setIsPlaying] = useState(false); // Controle de reprodução
  const [position, setPosition] = useState(0); // Posição da música
  const [duration, setDuration] = useState(0); // Duração total da música

  const soundRef = useRef(null); // Referência para o áudio
  const [lastPlayedSong, setLastPlayedSong] = useState(null); // Variável para armazenar a última música tocada

  // Link da música "Never Gonna Give You Up" de Rick Astley
  const neverGonnaGiveYouUpUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';  // Usando link do Soundhelix (substitua se necessário)

  // Função para carregar a música no player
  const loadSong = async () => {
    const { sound, status } = await Audio.Sound.createAsync(
      { uri: neverGonnaGiveYouUpUrl },
      { shouldPlay: false },
      onPlaybackStatusUpdate
    );
    setSound(sound);
    setDuration(status.durationMillis); // Definindo a duração da música
    setPosition(status.positionMillis); // Definindo a posição inicial
  };

  // Função para controlar o status da reprodução
  const onPlaybackStatusUpdate = (status) => {
    setIsPlaying(status.isPlaying);
    setPosition(status.positionMillis);
    if (status.isLoaded) {
      setDuration(status.durationMillis);
    }
  };

  // Função para abrir o player com a última música tocada
  const openPlayer = async () => {
    setIsModalVisible(true);
    await loadSong(); // Carregar a música "Never Gonna Give You Up"
  };

  // Função para controlar o botão play/pause
  const togglePlayPause = async () => {
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  // Função para reiniciar a música
  const restartSong = async () => {
    await sound.replayAsync();
    setPosition(0); // Resetando a posição para o início
  };

  // Função para fechar o player
  const closePlayer = () => {
    sound.unloadAsync(); // Liberando os recursos do áudio
    setIsModalVisible(false);
    setSelectedSong(null);
    setIsPlaying(false);
    setPosition(0);
  };

  // Função para redirecionar para a página de perfil
  const openProfile = () => {
    window.location.href = 'http://localhost:8081/perfil';
  };

  // Função para renderizar cada item da lista de músicas
  const renderSongItem = ({ item }) => (
    <View style={styles.songItem}>
      <Text style={styles.songTitle}>{item.title}</Text>
      <Text style={styles.artist}>{item.artist}</Text>
      <TouchableOpacity
        style={styles.playButton}
        onPress={openPlayer} // Abre o player com a música "Never Gonna Give You Up"
      >
        <Text style={styles.playButtonText}>Tocar</Text>
      </TouchableOpacity>
    </View>
  );

  // Função para abrir a última música tocada no modal
  const openLastPlayedSong = () => {
    openPlayer(); // Abre o player com a música "Never Gonna Give You Up"
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Músicas Pop Famosas</Text>

      {/* Botão de perfil no canto superior direito */}
      <TouchableOpacity style={styles.profileButton} onPress={openProfile}>
        <Icon name="user" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Lista de músicas */}
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={renderSongItem}
      />

      {/* Modal para o player de música */}
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

            {/* Slider para controlar a posição da música */}
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
            
            {/* Status do player */}
            <Text style={styles.playerText}>
              {isPlaying ? 'Tocando...' : 'Pausado'}
            </Text>
            
            {/* Controles do player */}
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

      {/* Botão para abrir o player */}
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

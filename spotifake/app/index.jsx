import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const LoginScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogin = () => {
    // Abrir a URL na mesma página, sem abrir uma nova aba
    window.location.href = 'http://localhost:8081/home'; // Isso fará com que a página atual seja substituída
  };

  const handleForgotPassword = () => {
    console.log('Simular redirecionamento para página de recuperação de senha');
  };

  useEffect(() => {
    // Carregar o tema, sem lógica de tema, apenas para protótipo
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <TouchableOpacity style={styles.themeSwitch} onPress={toggleTheme}>
        <Icon name={isDarkMode ? 'sun' : 'moon'} size={24} color={isDarkMode ? '#FFF' : '#000'} />
      </TouchableOpacity>

      <Text style={[styles.title, isDarkMode && styles.darkText]}>Bem-vindo de volta!</Text>
      <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>Faça login na sua conta</Text>

      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Email"
        placeholderTextColor={isDarkMode ? '#aaa' : '#777'}
      />

      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Senha"
        secureTextEntry
        placeholderTextColor={isDarkMode ? '#aaa' : '#777'}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={handleForgotPassword}>
        <Text style={[styles.linkText, isDarkMode && styles.darkText]}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      <Text style={[styles.signUpText, isDarkMode && styles.darkText]}>
        Ainda não tem conta?{' '}
        <TouchableOpacity onPress={() => { window.location.href = 'http://localhost:8081/register'; }}>
          <Text style={[styles.signUpLink, isDarkMode && styles.darkLink]}>Cadastrar-se</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ff6f00', // Cor alaranjada de fundo
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  themeSwitch: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  darkText: {
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#ffa726', // Laranja suave para as bordas
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 15, // Bordas mais arredondadas
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#ffa726', // Sombras sutis para dar mais destaque
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  darkInput: {
    backgroundColor: '#333',
    borderColor: '#555',
    color: '#fff',
  },
  button: {
    backgroundColor: '#ff5722', // Laranja vibrante para o botão
    paddingVertical: 15,
    borderRadius: 15, // Bordas arredondadas
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#ff5722', // Sombras sutis
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  linkText: {
    color: '#ff5722',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  signUpText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  signUpLink: {
    color: '#ff5722', // Laranja vibrante para o link
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;

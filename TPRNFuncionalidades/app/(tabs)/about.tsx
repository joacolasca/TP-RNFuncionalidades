import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import QRCode from 'react-native-qrcode-svg';
import { ThemedText } from '@/components/ThemedText';
import BackgroundContainer from '@/components/BackgroundContainer';
import { showError } from '@/utils/notifications';

const TEAM_INFO = {
  teamName: "Grupo Goat",
  members: [
    "Integrante 1: Tomás Lerman",
    "Integrante 2: Joaquin Lasca",
    "Integrante 3: Nicolas Simone"
  ]
};

export default function AboutScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedTeam, setScannedTeam] = useState<any>(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    try {
      const teamData = JSON.parse(data);
      setScannedTeam(teamData);
      setScanning(false);
    } catch (error) {
      showError('QR inválido');
      setScanning(false);
    }
  };

  return (
    <BackgroundContainer>
      <View style={styles.container}>
        <ThemedText style={styles.title}>Acerca de</ThemedText>
        
        <View style={styles.qrContainer}>
          <QRCode
            value={JSON.stringify(TEAM_INFO)}
            size={200}
            backgroundColor="white"
          />
        </View>

        <View style={styles.teamInfo}>
          <ThemedText style={styles.subtitle}>Nuestro Equipo:</ThemedText>
          {TEAM_INFO.members.map((member, index) => (
            <ThemedText key={index} style={styles.member}>{member}</ThemedText>
          ))}
        </View>

        <Button 
          title="Escanear otro equipo" 
          onPress={() => setScanning(true)} 
        />

        <Modal visible={scanning} animationType="slide">
          <View style={styles.scannerContainer}>
            {hasPermission ? (
              <BarCodeScanner
                onBarCodeScanned={handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
              />
            ) : (
              <ThemedText>No hay acceso a la cámara</ThemedText>
            )}
            <Button title="Cancelar" onPress={() => setScanning(false)} />
          </View>
        </Modal>

        <Modal visible={!!scannedTeam} animationType="fade" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ThemedText style={styles.modalTitle}>
                {scannedTeam?.teamName || 'Equipo'}
              </ThemedText>
              {scannedTeam?.members?.map((member: string, index: number) => (
                <ThemedText key={index} style={styles.modalMember}>
                  {member}
                </ThemedText>
              ))}
              <Button title="Cerrar" onPress={() => setScannedTeam(null)} />
            </View>
          </View>
        </Modal>
      </View>
    </BackgroundContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
  },
  teamInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  member: {
    fontSize: 16,
    marginBottom: 5,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMember: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
}); 
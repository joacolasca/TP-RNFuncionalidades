import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native';
import * as Contacts from 'expo-contacts';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import BackgroundContainer from '@/components/BackgroundContainer';
import { showError } from '@/utils/notifications';

interface Contact {
  id: string;
  name: string;
  phoneNumbers?: Array<{
    id: string;
    number: string;
    isPrimary?: boolean;
  }>;
}

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          const formattedContacts = data
            .filter(contact => contact.firstName || contact.lastName)
            .map(contact => ({
              id: contact.id,
              name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Sin nombre',
              phoneNumbers: contact.phoneNumbers?.map(phone => ({
                id: phone.id || Math.random().toString(),
                number: phone.number || '',
                isPrimary: phone.isPrimary || false,
              })),
            }));
          setContacts(formattedContacts);
        }
      } else {
        showError('No se otorgaron permisos para acceder a los contactos');
      }
    } catch (error) {
      showError('Error al cargar los contactos');
    } finally {
      setLoading(false);
    }
  };

  const renderContactPhone = (phone: Contact['phoneNumbers'][0], index: number) => (
    <View key={phone.id || index} style={styles.phoneContainer}>
      <ThemedText style={styles.phoneNumber}>
        {phone.number}
        {phone.isPrimary && ' ⭐'}
      </ThemedText>
    </View>
  );

  const renderContact = ({ item }: { item: Contact }) => (
    <View style={styles.contactItem}>
      <ThemedText style={styles.contactName}>
        {item.name}
      </ThemedText>
      {item.phoneNumbers?.map((phone, index) => renderContactPhone(phone, index))}
    </View>
  );

  if (loading) {
    return (
      <BackgroundContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <ThemedText style={styles.loadingText}>
            Cargando contactos...
          </ThemedText>
        </View>
      </BackgroundContainer>
    );
  }

  return (
    <BackgroundContainer>
      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No se encontraron contactos
            </ThemedText>
          </View>
        }
      />
    </BackgroundContainer>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  contactItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  phoneNumber: {
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
  },
}); 
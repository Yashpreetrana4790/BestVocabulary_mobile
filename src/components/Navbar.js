import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function Navbar({ title = 'Best Vocabulary' }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigation = useNavigation();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogin = () => {
    setShowMenu(false);
    navigation.navigate('Login');
  };

  const handleLogout = async () => {
    setShowMenu(false);
    await logout();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>{title}</Text>
      
      <TouchableOpacity
        style={styles.avatarButton}
        onPress={() => setShowMenu(true)}
      >
        {isAuthenticated && user ? (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user.fullName)}</Text>
          </View>
        ) : (
          <View style={styles.loginButton}>
            <Ionicons name="log-in-outline" size={22} color="#6366f1" />
          </View>
        )}
      </TouchableOpacity>

      {/* User Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            {isAuthenticated && user ? (
              <>
                <View style={styles.menuHeader}>
                  <View style={styles.menuAvatar}>
                    <Text style={styles.menuAvatarText}>
                      {getInitials(user.fullName)}
                    </Text>
                  </View>
                  <View style={styles.menuUserInfo}>
                    <Text style={styles.menuUserName}>{user.fullName}</Text>
                    <Text style={styles.menuUserEmail}>{user.email}</Text>
                  </View>
                </View>

                <View style={styles.menuDivider} />

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenu(false);
                    navigation.navigate('Profile');
                  }}
                >
                  <Ionicons name="person-outline" size={22} color="#475569" />
                  <Text style={styles.menuItemText}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenu(false);
                    navigation.navigate('SavedWords');
                  }}
                >
                  <Ionicons name="bookmark-outline" size={22} color="#475569" />
                  <Text style={styles.menuItemText}>Saved Words</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenu(false);
                    navigation.navigate('Progress');
                  }}
                >
                  <Ionicons name="stats-chart-outline" size={22} color="#475569" />
                  <Text style={styles.menuItemText}>Progress</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenu(false);
                    navigation.navigate('Settings');
                  }}
                >
                  <Ionicons name="settings-outline" size={22} color="#475569" />
                  <Text style={styles.menuItemText}>Settings</Text>
                </TouchableOpacity>

                <View style={styles.menuDivider} />

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={22} color="#ef4444" />
                  <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleLogin}
              >
                <Ionicons name="log-in-outline" size={22} color="#6366f1" />
                <Text style={[styles.menuItemText, styles.loginText]}>Login / Register</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  avatarButton: {
    padding: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  loginButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  menuUserInfo: {
    flex: 1,
  },
  menuUserName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  menuUserEmail: {
    fontSize: 14,
    color: '#64748b',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#475569',
    marginLeft: 16,
    fontWeight: '500',
  },
  loginText: {
    color: '#6366f1',
    fontWeight: '600',
  },
  logoutText: {
    color: '#ef4444',
  },
});


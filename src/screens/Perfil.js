import { supabase } from '../../supabaseConfig';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from "react";
import {
  Alert, StyleSheet, View, TouchableOpacity, Text, TextInput, ActivityIndicator, Image
} from "react-native";

const Perfil = ({ navigation }) => {
  const [nome, setNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [fotoAtual, setFotoAtual] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      const user = authData?.user;

      if (authError || !user) {
        console.error("Erro ao obter usuário:", authError);
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      setNovoEmail(user.email);

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_name, profile_img")
        .eq("id", user.id)
        .single();

      if (userError) {
        console.error("Erro ao carregar dados do usuário:", userError);
      } else {
        setNome(userData.user_name || "");
        setFotoAtual(userData.profile_img || "");
      }
    };

    fetchUserData();
  }, []);

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Permita o acesso à galeria para trocar a foto."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        await uploadImageToSupabase(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  };

  const uploadImageToSupabase = async (uri) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.getUser();
      const user = data?.user;

      if (error || !user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      let fileExt = uri.split(".").pop().toLowerCase();
      if (!fileExt || fileExt.length > 4) fileExt = "jpg";

      const validExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
      if (!validExtensions.includes(fileExt)) fileExt = "jpg";

      const timestamp = new Date().getTime();
      const fileName = `${user.id}+${timestamp}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;


      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileBuffer = Uint8Array.from(atob(base64), (c) =>
        c.charCodeAt(0)
      );

      const { error: uploadError } = await supabase.storage
        .from("profile-avatar")
        .upload(filePath, fileBuffer, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("profile-avatar")
        .getPublicUrl(filePath);

      const finalUrl = `${urlData.publicUrl}?t=${timestamp}`;
      setFotoAtual(finalUrl);

      const { error: updateError } = await supabase
        .from("users")
        .update({ profile_img: finalUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      Alert.alert("Erro", error.message || "Não foi possível atualizar a foto de perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    try {
      await supabase
        .from("users")
        .update({ user_name: nome })
        .eq("id", user.id);

      if (novoEmail !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: novoEmail,
        });
        if (emailError) throw emailError;
      }

      if (novaSenha) {
        const { error: senhaError } = await supabase.auth.updateUser({
          password: novaSenha,
        });
        if (senhaError) throw senhaError;
      }

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar perfil: ", error);
      Alert.alert("Erro", error.message || "Ocorreu um erro ao atualizar o perfil.");
    }
  };
  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={handlePickImage} style={{ alignItems: "center", marginBottom: 20 }}>
        {fotoAtual ? (
          <Image
            source={{ uri: fotoAtual }}
            style={{ width: 120, height: 120, borderRadius: 60 }}
          />
        ) : (
          <View style={styles.foto}>
            <Image
              source={require("../assets/perfil.png")}
              style={{ width: 120, height: 120, borderRadius: 60 }}
            />
          </View>
        )}
        <Text style={{ margin: 10, color: "white", fontSize: 16 }}>Alterar Foto</Text>
      </TouchableOpacity>


      <Text style={styles.textInput}>Nome:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          padding: 10,
          marginBottom: 15,
          color: 'white'
        }}
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
        placeholderTextColor={'white'}
      />

      <Text style={styles.textInput}>Email:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          padding: 10,
          marginBottom: 15,
          color: 'white'
        }}
        placeholder="Digite seu email"
        value={novoEmail}
        onChangeText={setNovoEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={'white'}
      />

      <Text style={styles.textInput}>Nova senha:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          padding: 10,
          marginBottom: 15,
          color: 'white'
        }}
        placeholder="Digite a nova senha"
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
        placeholderTextColor={'white'}
      />

      <TouchableOpacity onPress={handleUpdateProfile} style={styles.botaoSalvar} disabled={isLoading}>
        {isLoading ? (<ActivityIndicator color="#fff" />)
          : (
            <Text style={styles.textSalvar}>Salvar alterações</Text>
          )}
      </TouchableOpacity>
    </View>
  );

};

export default Perfil;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2e2e34',
    height: 1000,
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  input: {
    height: 42,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 18,
    backgroundColor: '#fff',
    color: '#fff',
    borderWidth: 2,
    marginBottom: 20,
    width: 300,
    paddingLeft: 10,
    borderRadius: 10,
  },
  textInput: {
    fontFamily: 'Gotham',
    fontWeight: 700,
    color: '#fff',
    fontSize: 15,
    marginBottom: 10,
  },
  img: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 100
  },
  foto: {
    width: 165,
    height: 165,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  botaoSalvar: {
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: 'rgb(83, 72, 207)',
    width: 180,
    height: 40,
    borderRadius: 20,
    padding: 7,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  textSalvar: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Gotham',
    fontWeight: 700,
    textAlign: 'center',
  }
});


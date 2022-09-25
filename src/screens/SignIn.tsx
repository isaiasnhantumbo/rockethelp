import auth from "@react-native-firebase/auth";
import { Heading, Icon, VStack, useTheme } from "native-base";
import { Envelope, Key } from "phosphor-react-native";
import { useState } from "react";
import { Alert } from "react-native";

import LogoSvg from "../assets/logo_primary.svg";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

export function SignIn() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignIn() {
    console.table(email, password);
    if (!email || !password) {
      return Alert.alert("Entrar", "Preencha os campos");
    }
    setIsLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        if (error.code == "auth/invalid-email") {
          return Alert.alert("Entrar", "E-mail ou senha invalida");
        }
        if (error.code == "auth/wrong-password") {
          return Alert.alert("Entrar", "E-mail ou senha invalida");
        }
        if (error.code == "auth/user-not-found") {
          return Alert.alert("Entrar", "Usuário nao registado");
        }
        return Alert.alert("Entrar", "Nao foi possivel fazer login");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <LogoSvg />
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>
      <Input
        mb={4}
        placeholder="Email"
        onChangeText={setEmail}
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
      />

      <Input
        mb={8}
        placeholder="Senha"
        onChangeText={setPassword}
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
      />

      <Button
        title="Entrar"
        w="full"
        onPress={handleSignIn}
        isLoading={isLoading}
      />
    </VStack>
  );
}

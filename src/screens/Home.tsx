import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import {
  Center,
  FlatList,
  HStack,
  Heading,
  IconButton,
  Text,
  VStack,
  useTheme,
} from "native-base";
import { ChatTeardropDots, SignOut } from "phosphor-react-native";
import { useEffect, useState } from "react";
import Reactotron from "reactotron-react-native";

import Logo from "../assets/logo_secondary.svg";
import { Button } from "../components/Button";
import { Filter } from "../components/Filter";
import { Loading } from "../components/Loading";
import { Order, OrderProps } from "../components/Order";
import { dateFormat } from "../utils/firestoreDateFormat";

export function Home() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [statusSelected, setStatusSelected] = useState<"open" | "closed">(
    "open"
  );
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  function handleNewOrder() {
    navigation.navigate("new");
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate("details", { orderId });
  }

  function handleSignOut() {
    auth()
      .signOut()
      .then((res) => {
        console.log(res);

        Reactotron.log(res);
      })
      .catch((error) => {
        console.log(error);

        Reactotron.log(error);
      });
  }
  useEffect(() => {
    setIsLoading(true);
    const subscriber = firestore()
      .collection("orders")
      .where("status", "==", statusSelected)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { patrimony, description, status, created_at } = doc.data();
          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(created_at),
          };
        });
        setOrders(data);
        setIsLoading(false);
      });
    return subscriber;
  }, [statusSelected]);

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />
        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleSignOut}
        />
      </HStack>
      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100">Solicitações</Heading>
          <Text color="gray.200">{orders.length}</Text>
        </HStack>
        <HStack space={3} mb={8}>
          <Filter
            title="Em Andamento"
            type="open"
            onPress={() => setStatusSelected("open")}
            isActive={statusSelected === "open"}
          />
          <Filter
            title="Finalizados"
            type="closed"
            onPress={() => setStatusSelected("closed")}
            isActive={statusSelected === "closed"}
          />
        </HStack>
        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Order data={item} onPress={() => handleOpenDetails(item.id)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardropDots color={colors.gray[300]} size={40} />
                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                  Voce nao possui {"\n"} solicitações{" "}
                  {statusSelected === "open" ? "em andamento" : "finalizadas"}
                </Text>
              </Center>
            )}
          />
        )}
        <Button title="Nova solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}

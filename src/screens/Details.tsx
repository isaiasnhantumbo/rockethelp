import firestore from "@react-native-firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Box, HStack, ScrollView, Text, VStack, useTheme } from "native-base";
import {
  CircleWavyCheck,
  ClipboardText,
  DesktopTower,
  Hourglass,
} from "phosphor-react-native";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

import { Button } from "../components/Button";
import { CardDetails } from "../components/CardDetails";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Loading } from "../components/Loading";
import { OrderProps } from "../components/Order";
import { OrderFirestoreDTO } from "../DTOs/OrderDTO";
import { dateFormat } from "../utils/firestoreDateFormat";

type RouteParams = {
  orderId: string;
};

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
};

export function Details() {
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState("");
  const { colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params as RouteParams;
  function handleCloseOrder() {
    if (!solution) {
      return Alert.alert(
        "Solitacao",
        "Informe a solucao para encerrar a solitacao"
      );
    }
    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .update({
        status: "closed",
        solution,
        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then((res) => {
        console.log(res);
        Alert.alert("Solitacao", "Solicitacao Encerrada");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Solitacao", "Erro ao encerrar a solitacao");
      });
  }
  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          patrimony,
          description,
          status,
          created_at,
          closed_at,
          solution,
        } = doc.data();
        const closed = closed_at ? dateFormat(closed_at) : null;
        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          when: dateFormat(created_at),
          closed,
          solution,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>
      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === "closed" ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}
        <Text
          fontSize="sm"
          color={
            order.status === "closed"
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === "closed" ? "Finalizado" : "Em andamento"}
        </Text>
      </HStack>
      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="equipamento"
          description={`Património ${order.patrimony}`}
          icon={DesktopTower}
        />
        <CardDetails
          title="Descricao do problema"
          description={order.description}
          icon={ClipboardText}
          footer={`Registado  em ${order.when}`}

        />
        <CardDetails
          title="Solucao"
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerado em ${order.closed}`}
        >
          {order.status === "open" && (
            <Input
              placeholder="Descrição da solução"
              onChangeText={setSolution}
              textAlignVertical="top"
              h={24}
              multiline
            />
          )}
        </CardDetails>
      </ScrollView>
      {order.status === "open" && (
        <Button title="Encerrar solicitação" m={5} onPress={handleCloseOrder} />
      )}
    </VStack>
  );
}

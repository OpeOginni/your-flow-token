import "../../flow/config";
const axios = require("axios");
import {
  Badge,
  Grid,
  Box,
  Text,
  useToast,
  GridItem,
  Spinner,
} from "@chakra-ui/react";
import Link from "next/link";

const LoadingUserTokensList = async () => {
  return (
    <div className="flex flex-col">
      <Grid padding="5" templateColumns="repeat(8, 1fr)" gap={6}>
        <GridItem colSpan={2}>
          <Spinner />
        </GridItem>

        <GridItem colSpan={2}>
          <Spinner />
        </GridItem>

        <GridItem colSpan={2}>
          <Spinner />
        </GridItem>

        <GridItem colSpan={2}>
          <Spinner />
        </GridItem>
      </Grid>
    </div>
  );
};

export default LoadingUserTokensList;

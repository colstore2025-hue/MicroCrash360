import cron from "node-cron";
import { CollectionService } from "../services/collectionService.js";

const service = new CollectionService();

// Ejecuta cada minuto (puedes cambiarlo)
cron.schedule("* * * * *", async () => {
  console.log("⏰ Ejecutando cobranza automática...");

  const actions = await service.checkLatePayments();

  if (actions.length > 0) {
    console.log("🚨 Acciones de cobranza:", actions);

    // Aquí luego conectas WhatsApp
  }
});
import { ReactiveTriggerSchema } from "beast-contracts/orchestration";
import { WorkflowEngine } from "./WorkflowEngine";
import { publishEvent } from "../data/EventPublisher";

export class ReactiveTriggerEngine {
  async trigger(envelope) {
    const valid = ReactiveTriggerSchema.safeParse(envelope);
    if (!valid.success) throw new Error("Invalid reactive trigger envelope");

    const { workflow, context, sourceEvent } = valid.data;

    const engine = new WorkflowEngine();
    const result = await engine.run(workflow, context);

    publishEvent("orch.reactive.triggered", {
      id: crypto.randomUUID(),
      workflow: workflow.workflow,
      sourceEvent,
      result,
      triggeredAt: new Date().toISOString()
    });

    return result;
  }
}

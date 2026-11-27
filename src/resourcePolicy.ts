export const RESOURCE_POLICY = {
  timeSeconds: { min: 1, max: 10, defaultValue: 1 },
  memoryMb: { min: 64, max: 512, defaultValue: 128 },
} as const;

interface ResourceDefaults {
  timeSeconds: number;
  memoryMb: number;
}

const STORAGE_KEY = "autota.resource-defaults";

export function isResourceValue(
  value: unknown,
  range: { min: number; max: number },
): value is number {
  return (
    typeof value === "number" && Number.isInteger(value) && value >= range.min && value <= range.max
  );
}

export function readResourceDefaults(): ResourceDefaults {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    if (
      isResourceValue(saved?.timeSeconds, RESOURCE_POLICY.timeSeconds) &&
      isResourceValue(saved?.memoryMb, RESOURCE_POLICY.memoryMb)
    ) {
      return { timeSeconds: saved.timeSeconds, memoryMb: saved.memoryMb };
    }
  } catch {
    // 저장소를 읽을 수 없으면 서비스 기본값을 사용한다.
  }
  return {
    timeSeconds: RESOURCE_POLICY.timeSeconds.defaultValue,
    memoryMb: RESOURCE_POLICY.memoryMb.defaultValue,
  };
}

export function saveResourceDefaults(defaults: ResourceDefaults) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
}

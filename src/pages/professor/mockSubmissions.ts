/* TODO: 과제별 학생 제출 답안 API 연결 후 서버 응답으로 교체. 키는 과제 목록의 editKey */
export const SAMPLE_ANSWERS: Record<string, [string, string]> = {
  "sample-1": ["a, b = map(int, input().split())\nprint(a + b)", "values = list(map(int, input().split()))\nprint(sum(values))"],
  "sample-2": [
    "balance = 0\nfor char in input():\n    balance += 1 if char == '(' else -1\n    if balance < 0:\n        break\nprint('YES' if balance == 0 else 'NO')",
    "stack = []\nvalid = True\nfor char in input():\n    if char == '(':\n        stack.append(char)\n    elif stack:\n        stack.pop()\n    else:\n        valid = False\n        break\nprint('YES' if valid and not stack else 'NO')",
  ],
  "sample-3": [
    "from heapq import heappop, heappush\n\ndef shortest_paths(graph, start):\n    distances = {start: 0}\n    queue = [(0, start)]\n    while queue:\n        distance, node = heappop(queue)\n        if distances[node] != distance:\n            continue\n        for neighbor, weight in graph[node]:\n            candidate = distance + weight\n            if candidate < distances.get(neighbor, float('inf')):\n                distances[neighbor] = candidate\n                heappush(queue, (candidate, neighbor))\n    return distances",
    "def shortest_paths(graph, start):\n    distances = {start: 0}\n    for _ in graph:\n        for node, edges in graph.items():\n            for neighbor, weight in edges:\n                candidate = distances.get(node, float('inf')) + weight\n                if candidate < distances.get(neighbor, float('inf')):\n                    distances[neighbor] = candidate\n    return distances",
  ],
  "sample-4": [
    "from heapq import heappop, heappush\n\nqueue = []\n\ndef push(priority, value):\n    heappush(queue, (priority, value))\n\ndef pop():\n    return heappop(queue)[1]",
    "queue = []\n\ndef push(priority, value):\n    queue.append((priority, value))\n\ndef pop():\n    item = min(queue)\n    queue.remove(item)\n    return item[1]",
  ],
};

/** 위에 없는 과제에 쓰는 기본 답안 */
export const DEFAULT_ANSWERS: [string, string] = [
  "def solve(data):\n    return sum(data)",
  "def solve(data):\n    total = 0\n    for value in data:\n        total += value\n    return total",
];

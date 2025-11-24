comps_json 内容为阵容相关接口返回的 JSON 数据Demo
- comps_data 为包含全部阵容数据的 JSON 字符串
- comps_details 为包含单个阵容详情数据的 JSON 字符串
- comps_stats 为包含全部阵容统计数据的 JSON 字符串

data_json 内容为基础数据相关接口返回的 JSON 字符串
- data_units 为包含全部单位（包括英雄）数据的 JSON 字符串
- data_items 为包含全部装备数据的 JSON 字符串
- data_augments 为包含全部强化符文数据的 JSON 字符串
- data_traits 为包含全部羁绊数据的 JSON 字符串

gen 中内容为Quicktype 根据comps_json、data_json生成的 TypeScript 文件


一些数据注释

comps_stats 中 每个 Result 表示一个阵容的统计数据，包含以下字段：
- cluster：阵容所属的集群（例如 "1" 表示第一集群），如果为空则表示所有集群，此时 places 只有一项，表示全部阵容的全部场次和
- places：长度为 9 的数组，表示该阵容在每个排位（1-8）的次数以及总出现次数
- count：该阵容的总出现次数



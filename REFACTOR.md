下面是代码质量，使用体验优化专项

1. 优化通用 FilterBar 组件，结合目前使用 FilterBar 组件的场景（可以提取一些通用的逻辑等）。 然后将 @apps/react/src/pages/AugmentsPage/components/AugmentFilter.tsx @apps/react/src/pages/ChampionsPage/components/ChampionFilter.tsx 用通用 FilterBar 组件重构
2.  优化，统一文件/组件结构，文件/组件命名。
3. 解耦合，拆逻辑。将组件中一些纯逻辑提取到 utils 中，如果是通用逻辑提取到整个package 的 utils 中，否则提取到组件所在的文件夹的 helper 中。注意：如果可以使用 lodash-es、ahooks 中的函数，尽量使用 lodash-es、ahooks 中的函数，而不是自己实现。


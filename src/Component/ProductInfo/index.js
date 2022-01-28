import * as S from "./style";
import Container from "Component/Container";
import SelectImg from "Util/SelectImg";
import React, { useContext, useEffect, useState } from "react";
import { PDcontext } from "store/PDdata.js";

/*

간략히=======================

이미지 

state X -> useEffect

props = {

  ProductInfoList = {

    categoryList:[],
    filterTagList:[],

    Product:{
      category:[],
      filterTag:[],
      name:"",
      description:"",
      thumbnail:"",
      imgs:"",
      stock:"",
    }

  }

}


자세히========================

props = {
  ProductInfoList = {
    category:[ // 전체 카테고리 목록
      {
        idx:1,
        content: "카테고리1" String
      },
      {
        idx:1,
        content: "카테고리2" String
      },
      ...
    ], 
    filterTag:[ // 전체 필터태그 목록
      {
        idx:1,
        content: "필터태그1" String
      },
      {
        idx:2,
        content: "필터태그2" String
      },
      ...
    ], 
    product:{ // 등록할 상품에 대한 정보
      category:[ // 선택한 카테고리,
        {
          idx:1,
          content:"카테고리1" String
        }
        ...
    ]
      filterTag:[ //// 선택한 필터태그
        {
          idx:1,
          content:"필터태그1" String
        }
        ...
      ]
      description:"" // string 상품 구성 소개 정보(설명)
      thumbnail: "" // string 상품 썸네일
      imgs: [ // 대표 이미지들
        {
          idx:1,
          content:"이미지1" String
        }
        ...
      ]
      stock: "" // int 상품 재고
    }
  }
}
*/

const ProductInfo = () => {
  return (
    <S.ProductInfoContainer>
      <Container
        ContainerHeader={<PIHeader />}
        ContainerContent={<PIContent />}
      />
    </S.ProductInfoContainer>
  );
};

export const PIHeader = (props) => {
  return <h4>상품 기본 정보</h4>;
};

export const PIContent = (props) => {
  const context = useContext(PDcontext).PIData;
  const state = context.state;
  const setState = context.setState;
  const [filterTagData, setFilterTagData] = useState();
  const [productImgList, setProductImgList] = useState([]);
  const [thumbnail, setThumbnail] = useState("");
  const [openFilterBox, setOpenFilterBox] = useState(false);
  const [filterTagInput, setFilterTagInput] = useState("");

  useEffect(() => {
    console.log("ProductInfo: ", state);
  }, [state]);

  useEffect(() => {
    const filterTagCopyData = [...state.filterTagList];

    setFilterTagData(searchResultSort(filterTagCopyData));
  }, [state.filterTagList]);

  useEffect(() => {
    if (thumbnail !== "") {
      const newState = { ...state };
      newState.product.thumbnail = thumbnail[0];
      thumbnail.shift();
      setState(newState);
    }
  }, [thumbnail]);

  useEffect(()=>{
    if(productImgList.length > 0){
      const newState = { ...state };
      newState.product.imgs = productImgList;
      setState(newState);
    }

  },[productImgList])

  const handleProductCategory = (e, item) => {
    const index = e.target.value;

    const newState = { ...state };

    if (!newState.categoryList[index].checked) {
      newState.product.category.push(newState.categoryList[index]);
    } else {
      const findIndex = newState.product.category.findIndex(
        (el) => el.idx === item.idx
      );
      newState.product.category.splice(findIndex, 1);
    }
    newState.categoryList[index].checked =
      !newState.categoryList[index].checked;

    setState(newState);
  };

  const handleProductFilterTag = (item, index) => {
    const newState = { ...state };

    const originalIndex = newState.filterTagList.findIndex(
      (el) => el.idx === item.idx
    );

    if (!newState.filterTagList[originalIndex].checked) {
      newState.product.filterTag.push(newState.filterTagList[index]);
    } else {
      newState.product.filterTag.splice(index, 1);
    }
    newState.filterTagList[originalIndex].checked =
      !newState.filterTagList[originalIndex].checked;

    setState(newState);
  };

  const handleProductFilterTagSearch = (e) => {
    setFilterTagInput(e.target.value);
  };

  const handleSearch = () => {
    let filterTagCopyData = [...state.filterTagList];

    filterTagCopyData =
      filterTagInput !== ""
        ? filterTagCopyData.filter((el) => {
            if (el.content.indexOf(filterTagInput) !== -1) return el;
          })
        : filterTagCopyData;

    setFilterTagData(searchResultSort(filterTagCopyData));
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const searchResultSort = (arr) => {
    arr.sort((a, b) => {
      let x = a.content;
      let y = b.content;

      if (x < y) return -1;
      if (x > y) return 1;
      return 0;
    });

    return arr;
  };

  const handleProductDescription = (e) => {
    const newState = { ...state };

    newState.product.description = e.target.value;

    setState(newState);
  };

  const handleProductName = (e) => {
    const newState = { ...state };

    newState.product.name = e.target.value;

    setState(newState);
  };

  return (
    <S.ItemContainer>
      <S.Item>
        <S.Title>카테고리</S.Title>
        <S.InnerContainer width={`500px`}>
          <S.ListContainer width={`50%`}>
            {state.categoryList.map((item, index) => {
              return (
                <S.ListItem key={item.idx}>
                  <S.Check
                    type="checkbox"
                    value={index}
                    onClick={(e) => {
                      handleProductCategory(e, item);
                    }}
                  />
                  {item.content}
                </S.ListItem>
              );
            })}
          </S.ListContainer>
          <S.ListContainer width={`30%`}>
            {state.product.category.map((item) => {
              return (
                <S.Tag key={item.idx}>
                  {item.content}
                  <button onClick={(e)=>{}}>X</button>
                </S.Tag>
              );
            })}
          </S.ListContainer>
        </S.InnerContainer>
      </S.Item>
      <S.Item>
        <S.Title>필터 태그</S.Title>
        <S.InnerContainer className="filterBox">
          <S.InputContainer>
            <input
              type="text"
              placeholder="필터태그를 검색해 주세요."
              onChange={(e) => {
                handleProductFilterTagSearch(e);
              }}
              onClick={() => {
                setOpenFilterBox(!openFilterBox);
              }}
              onKeyPress={(e) => {
                handleKeyUp(e);
              }}
            />
            <button
              onClick={() => {
                handleSearch();
              }}
            >
              검색
            </button>
          </S.InputContainer>
          {openFilterBox && (
            <S.FilterTagBox>
              <S.ListContainer className="filterList">
                {filterTagData.map((item, index) => {
                  return (
                    !item.checked && (
                      <S.ListItem
                        checked={item.checked}
                        className="filterItem"
                        onClick={() => {
                          handleProductFilterTag(item, index);
                        }}
                        key={item.idx}
                      >
                        {item.content}
                      </S.ListItem>
                    )
                  );
                })}
              </S.ListContainer>
            </S.FilterTagBox>
          )}
          {!openFilterBox && state.product.filterTag.length > 0 && (
            <S.FilterTagBox>
              <S.ListContainer className="filterList">
                {state.product.filterTag.map((item, index) => {
                  return (
                    item.checked && (
                      <S.ListItem
                        onClick={() => {
                          handleProductFilterTag(item, index);
                        }}
                        key={item.idx}
                      >
                        {item.content}
                      </S.ListItem>
                    )
                  );
                })}
              </S.ListContainer>
            </S.FilterTagBox>
          )}
        </S.InnerContainer>
      </S.Item>
      <S.Item>
        <S.Title>상품명</S.Title>
        <S.InnerContainer>
          <S.InputContainer>
            <input
              type="text"
              placeholder="상품명을 입력해주세요."
              onChange={(e) => {
                handleProductName(e);
              }}
            />
          </S.InputContainer>
          <S.ProductContainer>
            <span>상품 코드</span> <span>상품코드</span>
          </S.ProductContainer>
        </S.InnerContainer>
      </S.Item>
      <S.Item>
        <S.Title>상품 구성 소개 정보</S.Title>
        <S.InnerContainer>
          <S.InputContainer>
            <input
              type="text"
              onChange={(e) => {
                handleProductDescription(e);
              }}
              placeholder="상품 구성 소개 정보를 입력해 주세요."
            />
          </S.InputContainer>
        </S.InnerContainer>
      </S.Item>
      <S.Item>
        <S.Title>상품 썸네일</S.Title>
        <S.InnerContainer>
          <SelectImg imgList={thumbnail} imgSetter={setThumbnail} />
          <div>
            {state.product.thumbnail !== "" && state.product.thumbnail.name}
          </div>
        </S.InnerContainer>
      </S.Item>
      <S.Item>
        <S.Title>
          상품 대표 <br />
          이미지
        </S.Title>
        <S.InnerContainer>
          <SelectImg imgList={productImgList} imgSetter={setProductImgList}/>
          <S.ListContainer>
            {state.product.imgs.length > 0 &&
              state.product.imgs.map((item) => {
                return <S.ListItem key={item.name}>{item.name}</S.ListItem>;
              })}
          </S.ListContainer>
        </S.InnerContainer>
      </S.Item>
      <S.Item>
        <S.Title>상품 총 재고</S.Title>
        <S.InnerContainer>
          <span>NN개</span>
        </S.InnerContainer>
      </S.Item>
    </S.ItemContainer>
  );
};

export default React.memo(ProductInfo);
